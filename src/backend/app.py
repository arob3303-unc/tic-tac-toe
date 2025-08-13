from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

# Flask app setup
app = Flask(__name__)
CORS(app)  # Allow all origins for development

# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="thekey",
    database="tictactoe"
)
cursor = db.cursor(dictionary=True)

# ------------------ REGISTER ------------------
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"success": False, "message": "Username and password required"}), 400

        # Check if username already exists
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Username already taken"}), 409

        # Create new user
        cursor.execute(
            "INSERT INTO users (username, password, wins) VALUES (%s, %s, 0)",
            (username, password)
        )
        db.commit()

        return jsonify({"success": True, "username": username}), 200

    except Exception as e:
        print("Register error:", e)
        return jsonify({"success": False, "message": "Server error"}), 500


# ------------------ LOGIN ------------------
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"success": False, "message": "Username and password required"}), 400

        # Check credentials
        cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "Invalid username or password"}), 401

        return jsonify({"success": True, "username": username}), 200

    except Exception as e:
        print("Login error:", e)
        return jsonify({"success": False, "message": "Server error"}), 500

# ---------------- UPDATE WIN --------------------
@app.route("/win", methods=["POST"])
def record_win():
    data = request.get_json()
    username = data.get("username")
    cursor.execute("UPDATE users SET wins = wins + 1 WHERE username=%s", (username,))
    db.commit()
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
