import pymongo
from bson import ObjectId
from datetime import datetime

def seed_database():
    """Función para poblar la base de datos con datos de prueba"""
    
    # Conexión directa a MongoDB para el seeding
    client = pymongo.MongoClient("mongodb://localhost:27017/support_system")
    db = client.support_system
    
    # Limpiar colecciones existentes
    db.roles.delete_many({})
    db.users.delete_many({})
    db.tickets.delete_many({})
    
    print("Limpiando base de datos...")
    
    # Crear roles
    print("Creando roles...")
    roles = db.roles.insert_many([
        {
            "nombre": "admin",
            "descripcion": "Administrador del sistema",
            "permisos": ["crear", "leer", "actualizar", "eliminar"]
        },
        {
            "nombre": "soporte",
            "descripcion": "Personal de soporte técnico",
            "permisos": ["leer", "actualizar"]
        },
        {
            "nombre": "cliente",
            "descripcion": "Cliente del sistema",
            "permisos": ["crear", "leer"]
        }
    ])
    
    # Obtener IDs de los roles
    admin_role_id = roles.inserted_ids[0]
    soporte_role_id = roles.inserted_ids[1]
    cliente_role_id = roles.inserted_ids[2]
    
    # Crear usuarios
    print("Creando usuarios...")
    usuarios = db.users.insert_many([
        {
            "nombre": "Ana Torres",
            "email": "ana.torres@email.com",
            "telefono": "+52 555 123 4567",
            "rol_id": cliente_role_id,
            "fecha_registro": datetime.utcnow()
        },
        {
            "nombre": "Sofía Ramírez",
            "email": "sofia.ramirez@soporte.com",
            "telefono": "+52 555 987 6543",
            "rol_id": soporte_role_id,
            "fecha_registro": datetime.utcnow()
        },
        {
            "nombre": "Carlos Mendoza",
            "email": "carlos.mendoza@admin.com",
            "telefono": "+52 555 456 7890",
            "rol_id": admin_role_id,
            "fecha_registro": datetime.utcnow()
        },
        {
            "nombre": "María González",
            "email": "maria.gonzalez@email.com",
            "telefono": "+52 555 321 0987",
            "rol_id": cliente_role_id,
            "fecha_registro": datetime.utcnow()
        }
    ])
    
    # Crear tickets
    print("Creando tickets...")
    db.tickets.insert_many([
        {
            "titulo": "Error al iniciar sesión",
            "descripcion": "La contraseña no funciona correctamente y no puedo acceder a mi cuenta.",
            "estado": "open",
            "prioridad": "alta",
            "usuario_id": usuarios.inserted_ids[0],
            "fecha_creacion": datetime.utcnow(),
            "fecha_actualizacion": datetime.utcnow()
        },
        {
            "titulo": "Problema con la carga de archivos",
            "descripcion": "No puedo subir archivos PDF al sistema, aparece un error.",
            "estado": "in_progress",
            "prioridad": "media",
            "usuario_id": usuarios.inserted_ids[0],
            "fecha_creacion": datetime.utcnow(),
            "fecha_actualizacion": datetime.utcnow()
        },
        {
            "titulo": "Solicitud de nueva funcionalidad",
            "descripcion": "Me gustaría que agregaran la opción de exportar reportes en Excel.",
            "estado": "open",
            "prioridad": "baja",
            "usuario_id": usuarios.inserted_ids[3],
            "fecha_creacion": datetime.utcnow(),
            "fecha_actualizacion": datetime.utcnow()
        },
        {
            "titulo": "Error 500 en el dashboard",
            "descripcion": "Cuando accedo al dashboard principal aparece un error 500.",
            "estado": "resolved",
            "prioridad": "alta",
            "usuario_id": usuarios.inserted_ids[3],
            "fecha_creacion": datetime.utcnow(),
            "fecha_actualizacion": datetime.utcnow()
        }
    ])
    
    print("¡Base de datos poblada exitosamente!")
    print(f"Roles creados: {len(roles.inserted_ids)}")
    print(f"Usuarios creados: {len(usuarios.inserted_ids)}")
    print("Tickets creados: 4")
    
    # Cerrar conexión
    client.close()

if __name__ == "__main__":
    seed_database()
