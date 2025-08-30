"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "email and password required"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"message": "user already exists"}), 400

    user = User(email=email, is_active=True)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "user created"}), 201


@api.route('/token', methods=['POST'])
def token():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "invalid credentials"}), 401

    # For simplicity we will return a fake token (in a real app sign a JWT)
    token_value = f"token-for-{user.id}"

    return jsonify({"token": token_value, "user": user.serialize()}), 200


@api.route('/private', methods=['GET'])
def private():
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return jsonify({"message": "unauthorized"}), 401

    token = auth.split(' ', 1)[1]
    # Simple validation: token must start with 'token-for-'
    if not token.startswith('token-for-'):
        return jsonify({"message": "invalid token"}), 401

    return jsonify({"message": "this is a protected resource"}), 200
