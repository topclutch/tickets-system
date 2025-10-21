from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from routes.tickets import tickets_bp
from routes.users import users_bp
from routes.roles import roles_bp

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/support_system"
mongo = PyMongo(app)
app.mongo = mongo

# Rutas principales
@app.route('/')
def home():
    return jsonify({
        "message": "API del Sistema de Soporte",
        "endpoints": {
            "users": "/api/users",
            "tickets": "/api/tickets",
            "roles": "/api/roles"
        }
    })

@app.route('/health')
def health_check():
    try:
        # Verificar conexión a MongoDB
        app.mongo.db.command('ping')
        return jsonify({"status": "healthy", "database": "connected"})
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

# Registrar blueprints
app.register_blueprint(tickets_bp, url_prefix="/api/tickets")
app.register_blueprint(users_bp, url_prefix="/api/users")
app.register_blueprint(roles_bp, url_prefix="/api/roles")

if __name__ == "__main__":
    app.run(debug=True)
