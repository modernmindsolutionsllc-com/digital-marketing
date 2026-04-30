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

    # ── Build the row payload ────────────────────────────────────
    row = {
        "name": name,
        "phone_encrypted": encrypted_phone,
        "email": email,
        "company": company,
        "service": service or goal,       # audit form sends "service", smart-audit sends "goal"
        "adaptive_answer": adaptive_answer,
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
