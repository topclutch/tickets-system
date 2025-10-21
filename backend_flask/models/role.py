from bson import ObjectId
from flask import current_app

def validate_role_data(data):
    """Valida los datos del rol"""
    required_fields = ["nombre"]
    return all(field in data for field in required_fields)

def serialize_role(role):
    """Serializa un rol para JSON"""
    if role:
        role['_id'] = str(role['_id'])
    return role

class Role:
    @staticmethod
    def get_all():
        """Obtiene todos los roles"""
        try:
            roles = list(current_app.mongo.db.roles.find())
            return [serialize_role(role) for role in roles]
        except Exception as e:
            print(f"Error obteniendo roles: {e}")
            return []

    @staticmethod
    def get_by_id(role_id):
        """Obtiene un rol por ID"""
        try:
            role = current_app.mongo.db.roles.find_one({"_id": ObjectId(role_id)})
            return serialize_role(role) if role else None
        except Exception as e:
            print(f"Error obteniendo rol: {e}")
            return None

    @staticmethod
    def get_by_name(name):
        """Obtiene un rol por nombre"""
        try:
            role = current_app.mongo.db.roles.find_one({"nombre": name})
            return serialize_role(role) if role else None
        except Exception as e:
            print(f"Error obteniendo rol por nombre: {e}")
            return None

    @staticmethod
    def create(data):
        """Crea un nuevo rol"""
        try:
            if not validate_role_data(data):
                return None
            
            # Verificar que no exista un rol con el mismo nombre
            existing_role = current_app.mongo.db.roles.find_one({"nombre": data["nombre"]})
            if existing_role:
                return None
            
            result = current_app.mongo.db.roles.insert_one(data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creando rol: {e}")
            return None

    @staticmethod
    def update(role_id, data):
        """Actualiza un rol"""
        try:
            result = current_app.mongo.db.roles.update_one(
                {"_id": ObjectId(role_id)},
                {"$set": data}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error actualizando rol: {e}")
            return False

    @staticmethod
    def delete(role_id):
        """Elimina un rol"""
        try:
            # Verificar que no haya usuarios con este rol
            users_with_role = current_app.mongo.db.users.count_documents({"rol_id": ObjectId(role_id)})
            if users_with_role > 0:
                return False
            
            result = current_app.mongo.db.roles.delete_one({"_id": ObjectId(role_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error eliminando rol: {e}")
            return False
