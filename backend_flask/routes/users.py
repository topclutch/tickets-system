from flask import Blueprint, request, jsonify
from models.user import User

users_bp = Blueprint('users', __name__)

@users_bp.route('', methods=['GET'])
def get_users():
    """Obtiene todos los usuarios"""
    try:
        users = User.get_all()
        return jsonify({
            "success": True,
            "data": users,
            "count": len(users)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@users_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    """Obtiene un usuario por ID"""
    try:
        user = User.get_by_id(user_id)
        if user:
            return jsonify({
                "success": True,
                "data": user
            })
        else:
            return jsonify({
                "success": False,
                "error": "Usuario no encontrado"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@users_bp.route('', methods=['POST'])
def create_user():
    """Crea un nuevo usuario"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "error": "No se proporcionaron datos"
            }), 400
        
        user_id = User.create(data)
        if user_id:
            return jsonify({
                "success": True,
                "data": {"id": user_id},
                "message": "Usuario creado exitosamente"
            }), 201
        else:
            return jsonify({
                "success": False,
                "error": "Error al crear usuario"
            }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@users_bp.route('/<user_id>', methods=['PUT'])
def update_user(user_id):
    """Actualiza un usuario"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "error": "No se proporcionaron datos"
            }), 400
        
        success = User.update(user_id, data)
        if success:
            return jsonify({
                "success": True,
                "message": "Usuario actualizado exitosamente"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Usuario no encontrado o no se pudo actualizar"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@users_bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Elimina un usuario"""
    try:
        success = User.delete(user_id)
        if success:
            return jsonify({
                "success": True,
                "message": "Usuario eliminado exitosamente"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Usuario no encontrado"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
