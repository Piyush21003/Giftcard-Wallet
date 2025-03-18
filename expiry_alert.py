import os
import firebase_admin
from firebase_admin import credentials, db, auth
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timedelta

# Load environment secrets
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
FIREBASE_DB_URL = os.getenv("FIREBASE_DB_URL")

if not EMAIL_ADDRESS or not EMAIL_PASSWORD or not FIREBASE_DB_URL:
    raise ValueError("⚠️ Missing environment variables! Check GitHub Secrets.")

# Firebase setup
try:
    cred = credentials.Certificate("firebase_key.json")  # .gitignore me rahega
    firebase_admin.initialize_app(cred, {'databaseURL': FIREBASE_DB_URL})
    print("✅ Firebase initialized successfully!")
except Exception as e:
    print(f"🔥 Firebase initialization failed: {e}")

# SMTP email setup
def send_email(to_email, gift_card):
    subject = "🚨 Gift Card Expiry Alert"
    body = f"""
    Dear User,

    Your gift card is about to expire soon!

    🔹 Brand: {gift_card['brand']}
    🔹 Code: {gift_card['code']}
    🔹 PIN: {gift_card['pin']}
    🔹 Value: {gift_card.get('value', 'N/A')}
    🔹 Expiry Date: {gift_card['expiry']}

    Please use this gift card before it expires.

    Regards,  
    Zyft-Wallet Team 😎
    """

    msg = MIMEMultipart()
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls(context=context)
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, to_email, msg.as_string())
        print(f"📩 Email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")

# Fetch data from Firebase
def check_expiry():
    today = datetime.today().date()
    expiry_threshold = today + timedelta(days=7)

    ref = db.reference("giftCards")
    users = ref.get()

    if not users:
        print("⚠️ No gift cards found in the database.")
        return

    for user_id, cards in users.items():
        try:
            user = auth.get_user(user_id)
            user_email = user.email
        except Exception as e:
            print(f"❌ Failed to get user {user_id}: {e}")
            continue

        for card_id, card in cards.items():
            try:
                expiry_date = datetime.strptime(card['expiry'], "%Y-%m-%d").date()
                if today <= expiry_date <= expiry_threshold:
                    send_email(user_email, card)
            except Exception as e:
                print(f"❌ Error processing card {card_id}: {e}")

if __name__ == "__main__":
    check_expiry()
