from flask import Blueprint, request, jsonify
from models.ticket import Ticket

tickets_bp = Blueprint('tickets', __name__)

@tickets_bp.route('', methods=['GET'])
def get_tickets():
    """Obtiene todos los tickets"""
    try:
        # Verificar si se quiere filtrar por usuario
        user_id = request.args.get('user_id')
        
        if user_id:
            tickets = Ticket.get_by_user(user_id)
        else:
            tickets = Ticket.get_all()
        
        return jsonify({
            "success": True,
            "data": tickets,
            "count": len(tickets)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@tickets_bp.route('/<ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    """Obtiene un ticket por ID"""
    try:
        ticket = Ticket.get_by_id(ticket_id)
        if ticket:
            return jsonify({
                "success": True,
                "data": ticket
            })
        else:
            return jsonify({
                "success": False,
                "error": "Ticket no encontrado"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@tickets_bp.route('', methods=['POST'])
def create_ticket():
    """Crea un nuevo ticket"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "error": "No se proporcionaron datos"
            }), 400
        
        ticket_id = Ticket.create(data)
        if ticket_id:
            return jsonify({
                "success": True,
                "data": {"id": ticket_id},
                "message": "Ticket creado exitosamente"
            }), 201
        else:
            return jsonify({
                "success": False,
                "error": "Error al crear ticket"
            }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@tickets_bp.route('/<ticket_id>', methods=['PUT'])
def update_ticket(ticket_id):
    """Actualiza un ticket"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "error": "No se proporcionaron datos"
            }), 400
        
        success = Ticket.update(ticket_id, data)
        if success:
            return jsonify({
                "success": True,
                "message": "Ticket actualizado exitosamente"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Ticket no encontrado o no se pudo actualizar"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@tickets_bp.route('/<ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    """Elimina un ticket"""
    try:
        success = Ticket.delete(ticket_id)
        if success:
            return jsonify({
                "success": True,
                "message": "Ticket eliminado exitosamente"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Ticket no encontrado"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
