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


# ── Lead Scoring Engine ──────────────────────────────────────────
def calculate_lead_priority(goal_value, volume):
    """
    Calculates lead priority based on the scoring matrix.
    Returns 1 (Hot), 2 (Warm), or 3 (Cold).

    Priority 1 (Hot):
      - Volume is "200plus" (any goal)
      - Goal is "ecommerce" with volume "50to200"

    Priority 2 (Warm):
      - Volume is "50to200" (non-ecommerce goals)
      - Goal is "leadgen" with volume "under50"

    Priority 3 (Cold):
      - Everything else (awareness/ecommerce with under50, or no volume)
    """
    # Normalize inputs
    g = (goal_value or "").lower().strip()
    v = (volume or "").lower().strip()

    # ── Priority 1: Hot leads ────────────────────────────────────
    if v == "200plus":
        return 1
    if g == "ecommerce" and v == "50to200":
        return 1

    # ── Priority 2: Warm leads ───────────────────────────────────
    if v == "50to200" and g != "ecommerce":
        return 2
    if g == "leadgen" and v == "under50":
        return 2

    # ── Priority 3: Cold leads ───────────────────────────────────
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
    lead_volume = (body.get("lead_volume") or adaptive_answer).strip()  # fallback to adaptive_answer
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
    lead_priority = calculate_lead_priority(resolved_goal, lead_volume)

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
