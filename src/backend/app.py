from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

db = mysql.connector.connect(
    host="localhost",
    user="your_sql_user",
    password="your_mysql_password",
    database="tictactoe"
)
cursor = db.cursor()

@app.route('/login', methods={"POST"})
def login():
    data = request.get_json()
    cursor.execute("SELECT * FROM users WHERE username=%s AND password=%s",
                    (data["username"], data["password"]))
    user = cursor.fetchone()
    if user:
        return jsonify({"success": True, "username": data["username"]})
    return jsonify({"success": False}), 401

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    cursor.execute("SELECT * FROM users WHERE username=%s", (data["username"],))
    if cursor.fetchone():
        return jsonify({"success": False, "message": "Username taken!"}), 409
    cursor.execute("INSERT INTO users (username, password, wins) VALUES (%s, %s, 0)",
                   data["username", data["password"]])
    db.commit()
    return jsonify({"success": True, "username": data["username"]})\

if __name__ == "__main__":
    app.run(port=5000)