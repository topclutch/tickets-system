from flask import Blueprint, request, jsonify
from models.role import Role

roles_bp = Blueprint('roles', __name__)

@roles_bp.route('', methods=['GET'])
def get_roles():
    """Obtiene todos los roles"""
    try:
        roles = Role.get_all()
        return jsonify({
            "success": True,
            "data": roles,
            "count": len(roles)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@roles_bp.route('/<role_id>', methods=['GET'])
def get_role(role_id):
    """Obtiene un rol por ID"""
    try:
        role = Role.get_by_id(role_id)
        if role:
            return jsonify({
                "success": True,
                "data": role
            })
        else:
            return jsonify({
                "success": False,
                "error": "Rol no encontrado"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@roles_bp.route('/name/<role_name>', methods=['GET'])
def get_role_by_name(role_name):
    """Obtiene un rol por nombre"""
    try:
        role = Role.get_by_name(role_name)
        if role:
            return jsonify({
                "success": True,
                "data": role
            })
        else:
            return jsonify({
                "success": False,
                "error": "Rol no encontrado"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@roles_bp.route('', methods=['POST'])
def create_role():
    """Crea un nuevo rol"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "error": "No se proporcionaron datos"
            }), 400
        
        role_id = Role.create(data)
        if role_id:
            return jsonify({
                "success": True,
                "data": {"id": role_id},
                "message": "Rol creado exitosamente"
            }), 201
        else:
            return jsonify({
                "success": False,
                "error": "Error al crear rol o el rol ya existe"
            }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@roles_bp.route('/<role_id>', methods=['PUT'])
def update_role(role_id):
    """Actualiza un rol"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "error": "No se proporcionaron datos"
            }), 400
        
        success = Role.update(role_id, data)
        if success:
            return jsonify({
                "success": True,
                "message": "Rol actualizado exitosamente"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Rol no encontrado o no se pudo actualizar"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@roles_bp.route('/<role_id>', methods=['DELETE'])
def delete_role(role_id):
    """Elimina un rol"""
    try:
        success = Role.delete(role_id)
        if success:
            return jsonify({
                "success": True,
                "message": "Rol eliminado exitosamente"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Rol no encontrado o tiene usuarios asociados"
            }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
