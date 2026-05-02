import os

from flask import Flask, request, jsonify
from supabase import create_client, Client
from cryptography.fernet import Fernet, InvalidToken

# ── Env & Clients ────────────────────────────────────────────────
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SECRET_KEY = os.environ.get("MY_APP_SECRET_KEY")  # Same Fernet key used in submit.py

if not SUPABASE_URL or not SUPABASE_KEY or not SECRET_KEY:
    raise RuntimeError(
        "Missing required environment variables: "
        "SUPABASE_URL, SUPABASE_KEY, MY_APP_SECRET_KEY"
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
cipher = Fernet(SECRET_KEY.encode())

# ── Flask App ────────────────────────────────────────────────────
app = Flask(__name__)


# ── Auth helper ──────────────────────────────────────────────────
def authenticate_request():
    """
    Extracts the Bearer token from the Authorization header and verifies
    that the token (admin email) exists in the admins table.

    Returns the admin email on success, or None on failure.
    """
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header[7:].strip()
    if not token:
        return None

    # Verify this email exists in the admins table
    try:
        result = supabase.table("admins").select("email").eq("email", token).execute()
        if result.data and len(result.data) > 0:
            return token
    except Exception:
        pass

    return None


# ── Decryption helper ────────────────────────────────────────────
def decrypt_phone(encrypted_value):
    """
    Safely decrypts a Fernet-encrypted phone number.
    Returns the plain-text string on success, or a safe fallback on failure.
    """
    if not encrypted_value:
        return "—"

    try:
        return cipher.decrypt(encrypted_value.encode()).decode()
    except (InvalidToken, ValueError, Exception):
        return "[Decryption Error]"


# ── Route Handler ────────────────────────────────────────────────
@app.route("/", methods=["GET"])
@app.route("/api/dashboard_data", methods=["GET"])
def handle_dashboard_data():
    """
    Authenticated endpoint that returns all leads with decrypted phone numbers.

    Auth:    Bearer token in Authorization header (must match an admin email).
    Returns: { success: true, leads: [...] }
    """

    # ── 1. Authentication ────────────────────────────────────────
    admin_email = authenticate_request()
    if not admin_email:
        return jsonify({
            "success": False,
            "error": "Unauthorized. Please log in again.",
        }), 401

    # ── 2. Fetch all leads from Supabase ─────────────────────────
    try:
        result = (
            supabase
            .table("client_leads")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
    except Exception as exc:
        return jsonify({
            "success": False,
            "error": "Failed to fetch leads from database.",
        }), 500

    if not result.data:
        return jsonify({"success": True, "leads": []}), 200

    # ── 3. Decrypt and sanitize each lead ────────────────────────
    sanitized_leads = []

    for row in result.data:
        lead = {
            "id": row.get("id"),
            "name": row.get("name", ""),
            "email": row.get("email", ""),
            "phone": decrypt_phone(row.get("phone_encrypted")),
            "company": row.get("company", ""),
            "service": row.get("service", ""),
            "adaptive_answer": row.get("adaptive_answer", ""),
            "lead_priority": row.get("lead_priority", 3),
            "description": row.get("description", ""),
            "created_at": row.get("created_at", ""),
        }
        # phone_encrypted is deliberately excluded — never sent to the client
        sanitized_leads.append(lead)

    # ── 4. Return the clean response ─────────────────────────────
    return jsonify({
        "success": True,
        "leads": sanitized_leads,
        "total": len(sanitized_leads),
    }), 200
