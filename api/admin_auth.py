import os
import secrets
import smtplib
import ssl
from datetime import datetime, timezone, timedelta
from email.message import EmailMessage

from flask import Flask, request, jsonify
from supabase import create_client, Client

# ── Env & Clients ────────────────────────────────────────────────
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL")
SENDER_EMAIL_PASSWORD = os.environ.get("SENDER_EMAIL_PASSWORD")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── Flask App ────────────────────────────────────────────────────
app = Flask(__name__)

OTP_EXPIRY_MINUTES = 5


# ── Helpers ──────────────────────────────────────────────────────
def generate_secure_otp():
    """Cryptographically secure 6-digit numeric OTP."""
    return f"{secrets.randbelow(900000) + 100000}"


def send_otp_email(recipient_email, otp_code):
    """Send the OTP via Gmail SMTP with SSL."""
    if not SENDER_EMAIL or not SENDER_EMAIL_PASSWORD:
        raise RuntimeError("Email credentials not configured on the server.")

    subject = "MMSLLC Admin Portal - Secure Login Code"
    body = (
        f"Hello,\n\n"
        f"Your Admin authentication code is: {otp_code}\n\n"
        f"This code will expire in {OTP_EXPIRY_MINUTES} minutes. "
        f"Do not share this with anyone.\n\n"
        f"System: Modern Mind Solution LLC Secure Portal"
    )

    em = EmailMessage()
    em["From"] = SENDER_EMAIL
    em["To"] = recipient_email
    em["Subject"] = subject
    em.set_content(body)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
        smtp.login(SENDER_EMAIL, SENDER_EMAIL_PASSWORD)
        smtp.sendmail(SENDER_EMAIL, recipient_email, em.as_string())


def parse_timestamp(ts_string):
    """Safely parse an ISO timestamp from Supabase (handles Z suffix)."""
    if not ts_string:
        return None
    if ts_string.endswith("Z"):
        ts_string = ts_string[:-1] + "+00:00"
    return datetime.fromisoformat(ts_string)


# ── Route Handler ────────────────────────────────────────────────
@app.route("/", methods=["POST"])
@app.route("/api/admin_auth", methods=["POST"])
def handle_admin_auth():
    """
    Two actions based on the JSON payload:
      A) Request OTP  →  { "email": "..." }
      B) Verify OTP   →  { "email": "...", "otp": "123456" }
    """
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"success": False, "error": "Invalid or missing JSON body."}), 400

    email = (body.get("email") or "").strip().lower()
    otp = (body.get("otp") or "").strip()

    if not email:
        return jsonify({"success": False, "error": "Email is required."}), 400

    # ── Look up admin ────────────────────────────────────────────
    try:
        result = supabase.table("admins").select("*").eq("email", email).execute()
    except Exception as exc:
        return jsonify({"success": False, "error": f"Database error: {str(exc)}"}), 500

    if not result.data:
        return jsonify({
            "success": False,
            "error": "Unauthorized. This email is not registered as an admin."
        }), 401

    admin = result.data[0]

    # ══════════════════════════════════════════════════════════════
    # ACTION A: Request OTP (no otp in payload)
    # ══════════════════════════════════════════════════════════════
    if not otp:
        new_otp = generate_secure_otp()
        expires_at = (
            datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)
        ).isoformat()

        try:
            supabase.table("admins").update({
                "otp_code": new_otp,
                "otp_expires_at": expires_at,
            }).eq("email", email).execute()
        except Exception as exc:
            return jsonify({"success": False, "error": f"Failed to store OTP: {str(exc)}"}), 500

        try:
            send_otp_email(email, new_otp)
        except Exception as exc:
            return jsonify({"success": False, "error": f"Failed to send email: {str(exc)}"}), 500

        return jsonify({
            "success": True,
            "message": "A verification code has been sent to your email.",
        }), 200

    # ══════════════════════════════════════════════════════════════
    # ACTION B: Verify OTP
    # ══════════════════════════════════════════════════════════════
    stored_otp = admin.get("otp_code")
    expires_str = admin.get("otp_expires_at")

    if not stored_otp or not expires_str:
        return jsonify({
            "success": False,
            "error": "No active code found. Please request a new one."
        }), 401

    # Constant-time comparison (prevents timing attacks)
    if not secrets.compare_digest(otp, stored_otp):
        return jsonify({"success": False, "error": "Invalid verification code."}), 401

    # Check expiry
    expires_at = parse_timestamp(expires_str)
    if not expires_at or datetime.now(timezone.utc) > expires_at:
        supabase.table("admins").update({
            "otp_code": None, "otp_expires_at": None,
        }).eq("email", email).execute()
        return jsonify({
            "success": False,
            "error": "Code expired. Please request a new one."
        }), 401

    # ── Valid — clear OTP to prevent reuse ────────────────────────
    try:
        supabase.table("admins").update({
            "otp_code": None, "otp_expires_at": None,
        }).eq("email", email).execute()
    except Exception as exc:
        return jsonify({"success": False, "error": f"Cleanup failed: {str(exc)}"}), 500

    return jsonify({
        "success": True,
        "message": "Authentication successful. Welcome, Admin.",
        "admin_email": email,
    }), 200
