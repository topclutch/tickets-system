from bson import ObjectId
from flask import current_app
from datetime import datetime

def validate_ticket_data(data):
    """Valida los datos del ticket"""
    required_fields = ["titulo", "descripcion", "usuario_id"]
    return all(field in data for field in required_fields)

def serialize_ticket(ticket):
    """Serializa un ticket para JSON"""
    if ticket:
        ticket['_id'] = str(ticket['_id'])
        if 'usuario_id' in ticket:
            ticket['usuario_id'] = str(ticket['usuario_id'])
        # Convertir fechas a string si existen
        if 'fecha_creacion' in ticket:
            ticket['fecha_creacion'] = ticket['fecha_creacion'].isoformat()
        if 'fecha_actualizacion' in ticket:
            ticket['fecha_actualizacion'] = ticket['fecha_actualizacion'].isoformat()
    return ticket

class Ticket:
    @staticmethod
    def get_all():
        """Obtiene todos los tickets"""
        try:
            tickets = list(current_app.mongo.db.tickets.find())
            return [serialize_ticket(ticket) for ticket in tickets]
        except Exception as e:
            print(f"Error obteniendo tickets: {e}")
            return []

    @staticmethod
    def get_by_id(ticket_id):
        """Obtiene un ticket por ID"""
        try:
            ticket = current_app.mongo.db.tickets.find_one({"_id": ObjectId(ticket_id)})
            return serialize_ticket(ticket) if ticket else None
        except Exception as e:
            print(f"Error obteniendo ticket: {e}")
            return None

    @staticmethod
    def get_by_user(user_id):
        """Obtiene tickets por usuario"""
        try:
            tickets = list(current_app.mongo.db.tickets.find({"usuario_id": ObjectId(user_id)}))
            return [serialize_ticket(ticket) for ticket in tickets]
        except Exception as e:
            print(f"Error obteniendo tickets del usuario: {e}")
            return []

    @staticmethod
    def create(data):
        """Crea un nuevo ticket"""
        try:
            if not validate_ticket_data(data):
                return None
            
            # Convertir usuario_id a ObjectId si es string
            if 'usuario_id' in data and isinstance(data['usuario_id'], str):
                data['usuario_id'] = ObjectId(data['usuario_id'])
            
            # Agregar campos por defecto
            data['estado'] = data.get('estado', 'open')
            data['prioridad'] = data.get('prioridad', 'media')
            data['fecha_creacion'] = datetime.utcnow()
            data['fecha_actualizacion'] = datetime.utcnow()
            
            result = current_app.mongo.db.tickets.insert_one(data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creando ticket: {e}")
            return None

    @staticmethod
    def update(ticket_id, data):
        """Actualiza un ticket"""
        try:
            if 'usuario_id' in data and isinstance(data['usuario_id'], str):
                data['usuario_id'] = ObjectId(data['usuario_id'])
            
            data['fecha_actualizacion'] = datetime.utcnow()
            
            result = current_app.mongo.db.tickets.update_one(
                {"_id": ObjectId(ticket_id)},
                {"$set": data}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error actualizando ticket: {e}")
            return False

    @staticmethod
    def delete(ticket_id):
        """Elimina un ticket"""
        try:
            result = current_app.mongo.db.tickets.delete_one({"_id": ObjectId(ticket_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error eliminando ticket: {e}")
            return False
