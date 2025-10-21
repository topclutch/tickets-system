from bson import ObjectId
from flask import current_app

def validate_user_data(data):
    """Valida los datos del usuario"""
    required_fields = ["nombre", "email", "rol_id"]
    return all(field in data for field in required_fields)

def serialize_user(user):
    """Serializa un usuario para JSON"""
    if user:
        user['_id'] = str(user['_id'])
        if 'rol_id' in user:
            user['rol_id'] = str(user['rol_id'])
    return user

class User:
    @staticmethod
    def get_all():
        """Obtiene todos los usuarios"""
        try:
            users = list(current_app.mongo.db.users.find())
            return [serialize_user(user) for user in users]
        except Exception as e:
            print(f"Error obteniendo usuarios: {e}")
            return []

    @staticmethod
    def get_by_id(user_id):
        """Obtiene un usuario por ID"""
        try:
            user = current_app.mongo.db.users.find_one({"_id": ObjectId(user_id)})
            return serialize_user(user) if user else None
        except Exception as e:
            print(f"Error obteniendo usuario: {e}")
            return None

    @staticmethod
    def create(data):
        """Crea un nuevo usuario"""
        try:
            if not validate_user_data(data):
                return None
            
            # Convertir rol_id a ObjectId si es string
            if 'rol_id' in data and isinstance(data['rol_id'], str):
                data['rol_id'] = ObjectId(data['rol_id'])
            
            result = current_app.mongo.db.users.insert_one(data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creando usuario: {e}")
            return None

    @staticmethod
    def update(user_id, data):
        """Actualiza un usuario"""
        try:
            if 'rol_id' in data and isinstance(data['rol_id'], str):
                data['rol_id'] = ObjectId(data['rol_id'])
            
            result = current_app.mongo.db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": data}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error actualizando usuario: {e}")
            return False

    @staticmethod
    def delete(user_id):
        """Elimina un usuario"""
        try:
            result = current_app.mongo.db.users.delete_one({"_id": ObjectId(user_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error eliminando usuario: {e}")
            return False
