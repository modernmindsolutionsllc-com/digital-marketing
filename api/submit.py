import os
import json
from datetime import datetime, timezone

from flask import Flask, request, jsonify
from supabase import create_client, Client
from cryptography.fernet import Fernet

# ── Env & Clients ────────────────────────────────────────────────
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SECRET_KEY = os.environ.get("MY_APP_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_KEY or not SECRET_KEY:
    raise RuntimeError(
        "Missing required environment variables: "
        "SUPABASE_URL, SUPABASE_KEY, MY_APP_SECRET_KEY"
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
cipher = Fernet(SECRET_KEY.encode())

# ── Flask App ────────────────────────────────────────────────────
app = Flask(__name__)


# ── Lead Scoring Engine (Context-Aware) ──────────────────────────
def calculate_lead_priority(goal_value, adaptive_answer):
    """
    Context-aware lead scoring. The adaptive_answer field changes
    meaning depending on the goal:

      Lead Gen  → adaptive_answer = volume  (under50 / 50to200 / 200plus)
      Ecommerce → adaptive_answer = platform (shopify / woocommerce / custom)
      Awareness → adaptive_answer = channel  (social / content / influencer)

    Returns 1 (Hot), 2 (Warm), or 3 (Cold).
    """
    g = (goal_value or "").lower().strip()
    a = (adaptive_answer or "").lower().strip()

    # ── Lead Generation: score by volume ─────────────────────────
    if g == "leadgen":
        if a == "200plus":
            return 1   # Hot — high-volume pipeline
        if a == "50to200":
            return 2   # Warm — growing demand
        return 3       # Cold — early-stage

    # ── Ecommerce: score by platform complexity ──────────────────
    if g == "ecommerce":
        if a == "custom":
            return 1   # Hot — enterprise / bespoke build = big budget
        if a in ("shopify", "woocommerce"):
            return 2   # Warm — established store
        return 2       # Warm — unknown platform, still valuable

    # ── Brand Awareness: score by channel type ───────────────────
    if g == "awareness":
        if a == "influencer":
            return 2   # Warm — creator-led, high intent
        if a == "content":
            return 2   # Warm — SEO / editorial investment
        if a == "social":
            return 3   # Cold — broad organic reach
        return 3       # Cold — unspecified

    # ── Fallback for App.jsx audit form (no adaptive context) ────
    return 3


@app.route("/", methods=["POST"])
@app.route("/api/submit", methods=["POST"])
def handle_lead():
    """
    Accepts a JSON payload from the frontend contact / audit form,
    encrypts sensitive fields (phone), and inserts a row into the
    Supabase `client_leads` table.
    """

    # ── Parse incoming JSON ──────────────────────────────────────
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"success": False, "error": "Invalid or missing JSON body."}), 400

    name = (body.get("name") or "").strip()
    phone = (body.get("phone") or "").strip()
    email = (body.get("email") or "").strip()
    company = (body.get("company") or "").strip()
    service = (body.get("service") or "").strip()
    goal = (body.get("goal") or "").strip()
    adaptive_answer = (body.get("adaptiveAnswer") or "").strip()
    description = (body.get("description") or "").strip()

    # ── Basic validation ─────────────────────────────────────────
    if not name or not email or not phone:
        return jsonify({
            "success": False,
            "error": "Name, email, and phone are required fields."
        }), 422

    # ── Encrypt sensitive fields ─────────────────────────────────
    encrypted_phone = cipher.encrypt(phone.encode()).decode()

    # ── Calculate lead priority ───────────────────────────────────
    resolved_goal = service or goal
    lead_priority = calculate_lead_priority(resolved_goal, adaptive_answer)

    # ── Build the row payload ────────────────────────────────────
    row = {
        "name": name,
        "phone_encrypted": encrypted_phone,
        "email": email,
        "company": company,
        "service": resolved_goal,
        "adaptive_answer": adaptive_answer,
        "lead_priority": lead_priority,
        "description": description,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    # ── Insert into Supabase ─────────────────────────────────────
    try:
        result = supabase.table("client_leads").insert(row).execute()

        if result.data:
            return jsonify({"success": True, "message": "Lead saved successfully."}), 201
        else:
            return jsonify({
                "success": False,
                "error": "Insert returned no data. Check your Supabase table/RLS policies."
            }), 500

    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500
