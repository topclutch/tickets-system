# 🧾 Tickets System

Aplicación web **full-stack** para la gestión de tickets (soporte), compuesta por un frontend en **Angular** y un backend en **Flask**.  
Este README contiene instrucciones claras para instalar, ejecutar y contribuir al proyecto.

---

## 📁 Estructura del repositorio

    tickets-system/
    ├── backend_flask/        # API en Flask (Python)
    ├── frontend_angular/     # Frontend en Angular
    ├── .gitignore
    └── README.md

---

## 🧭 Requisitos previos

- Node.js >= 16 (npm)
- Angular CLI (opcional para desarrollo): `npm install -g @angular/cli`
- Python 3.8+
- pip
- (Opcional) Docker & docker-compose

---

## 🔧 Instalación y ejecución

### Backend — Flask

1. Entra en la carpeta del backend:

    cd backend_flask

2. Crea y activa un entorno virtual:

    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # macOS / Linux
    python3 -m venv venv
    source venv/bin/activate

3. Instala dependencias:

    pip install -r requirements.txt

4. Crea un archivo `.env` (o copia `.env.example`) y configura variables:

    # ejemplo de contenido en `.env` (no lo subas al repo)
    PORT=5000
    DATABASE_URI=sqlite:///db.sqlite3
    SECRET_KEY=your_secret_key

5. Ejecuta la aplicación en modo desarrollo:

    flask run --host=0.0.0.0 --port=5000

La API estará disponible en `http://localhost:5000`.

---

### Frontend — Angular

1. Entra en la carpeta del frontend:

    cd frontend_angular

2. Instala dependencias:

    npm install

3. Configura variables de entorno (si usas `environment.ts` o `.env`):

    # ejemplo (si el frontend consume la API en localhost)
    VITE_API_BASE=http://localhost:5000/api
    # (para Angular, ajusta en environment.ts o usa ng env vars)

4. Ejecuta en modo desarrollo:

    ng serve

El frontend estará disponible por defecto en `http://localhost:4200`.

> Nota: si prefieres Vite/otra configuración, adapta los comandos a tu setup.

---

## 🌐 Endpoints (resumen rápido)

### Backend (ejemplos)
- `POST /api/auth/login` — Iniciar sesión
- `POST /api/auth/register` — Registrar usuario
- `GET /api/users` — Listar usuarios (admin)
- `GET /api/sales` — Listar ventas (según rol)
- `POST /api/sales` — Crear venta
- `GET /api/products` — Listar productos (si aplica)

Incluye respuestas JSON estándar con `success`, `data` y `message`.

---

## ✅ Buenas prácticas (env / seguridad)

- **Nunca** subas archivos de configuración con secretos (`.env`) al repositorio.
- Incluye un `.env.example` con las variables necesarias (sin valores reales).
- Asegúrate de añadir al `.gitignore`:
    
    node_modules/
    venv/
    .env
    .env.*
    dist/
    build/
    .DS_Store
    *.log

---

## 🧪 Tests

- Backend (si existen tests): desde `backend_flask/` usa `pytest`:

    pytest

- Frontend (si existen tests): desde `frontend_angular/` usa Angular CLI:

    ng test

---

## 🐳 Docker (opcional)

Si tienes `Dockerfile` y `docker-compose.yml`, puedes levantar todo con:

    docker-compose up --build

Ajusta los servicios y las variables de entorno en `docker-compose.yml` según tu configuración.

---

## 📦 Deployment (sugerencias)

- Backend: Gunicorn + Nginx (o despliegue en plataformas como Heroku, Render, Railway).
- Frontend: construir (`ng build --prod`) y servir en Netlify, Vercel o detrás de Nginx.
- Para producción, usar HTTPS y rotar secretos (no usar `.env` en VCS).

---

## 🤝 Contribuciones

1. Haz fork del repositorio.  
2. Crea una rama: `git checkout -b feature/nombre-de-feature`.  
3. Realiza cambios y commits claros.  
4. Abre un Pull Request describiendo los cambios.

Por favor, documenta nuevos endpoints y actualiza `README.md` si agregas funcionalidades.

---

## 📝 Ejemplo de `.env.example`

Backend (`backend_flask/.env.example`):

    PORT=5000
    DATABASE_URI=sqlite:///db.sqlite3
    SECRET_KEY=your_secret_key
    # MAIL_SERVER=smtp...
    # OTHER_API_KEY=...

Frontend (`frontend_angular/.env.example` o environment.ts guía):

    VITE_API_BASE=http://localhost:5000/api

---

## 📄 Licencia

Este proyecto está bajo la **MIT License**. Añade un archivo `LICENSE` si aún no existe.

---
