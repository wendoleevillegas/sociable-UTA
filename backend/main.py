from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend

def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT)')
    conn.commit()
    conn.close()

# @app.route('/api/auth/register', methods=['POST'])
# def register():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     if not email or not password:
#         return jsonify({'message': 'Missing fields'}), 400

#     if len(password) < 6 or not any(c.isupper() for c in password) or not any(c.isdigit() for c in password):
#         return jsonify({'message': 'Weak password'}), 400

#     hashed_pw = generate_password_hash(password)

#     try:
#         conn = sqlite3.connect('users.db')
#         c = conn.cursor()
#         c.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed_pw))
#         conn.commit()
#         return jsonify({'message': 'User registered successfully'}), 201
#     except sqlite3.IntegrityError:
#         return jsonify({'message': 'Email already exists'}), 409
#     finally:
#         conn.close()
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json(force=True)
    except Exception as e:
        print("Failed to parse JSON:", e)
        return jsonify({'message': 'Invalid JSON'}), 400

    if not data:
        return jsonify({'message': 'No data provided'}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Missing fields'}), 400

    if len(password) < 6 or not any(c.isupper() for c in password) or not any(c.isdigit() for c in password):
        return jsonify({'message': 'Weak password'}), 400

    hashed_pw = generate_password_hash(password)

    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed_pw))
        conn.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Email already exists'}), 409
    finally:
        conn.close()


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = c.fetchone()
    conn.close()

    if user and check_password_hash(user[2], password):
        return jsonify({'message': 'Login successful', 'token': 'mock-token'}), 200
    return jsonify({'message': 'Incorrect email or password, please try again.'}), 401

if __name__ == '__main__':
    init_db()
    app.run(debug=True)