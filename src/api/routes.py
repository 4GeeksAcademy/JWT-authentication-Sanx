"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity 

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST', 'GET'])
def handle_signup():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    if not email:
        raise APIException("Se requiere email", status_code=400)
    if not password:
        raise APIException("Se requiere contraseña", status_code=400)

    user = User.query.filter_by(email=email).first()
    if user:
        raise APIException("El usuario con este email ya existe", status_code=409) # 409 Conflict

    hashed_password = current_app.extensions['flask-bcrypt'].generate_password_hash(password).decode('utf-8')

    new_user = User(email=email, password=hashed_password, is_active=True)
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise APIException(f"Error al crear usuario: {str(e)}", status_code=500)

    return jsonify({"message": "El usuario ha registrado correctamente. Por favor, incia sesion"}), 201

@api.route('/login', methods=['POST', 'GET'])
def handle_login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email:
        raise APIException("Se requiere email", status_code=400)
    if not password:
        raise APIException("Se requiere contraseña", status_code=400)

    user = User.query.filter_by(email=email).first()

    if user is None:
        raise APIException("Email o contraseña invalidos", status_code=401)

    password_check = current_app.extensions['flask-bcrypt'].check_password_hash(user.password, password)

    if not password_check:
        raise APIException("Email o contraseña invalidos", status_code=401)

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login correcto",
        "access_token": access_token,
        "user_id": user.id
    }), 200

@api.route("/private", methods=["GET"])
@jwt_required()
def handle_private():
    
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user is None:
        raise APIException("User not found or token invalid", status_code=404) 

    return jsonify({
        "message": f"¡Hola! Has accedido a un endpoint privado. Tu email es {user.email}."
    }), 200