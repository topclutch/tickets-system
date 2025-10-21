export interface User {
  id: string       // id ahora es string (coincide con _id de la API)
  name: string
  email: string
  telefono: string
  role: "admin" | "user" | "support"
  created_at?: string
  updated_at?: string
}

export interface CreateUserRequest {
  name: string
  email: string
  role: "admin" | "user" | "support"
  telefono: string
}

export interface UpdateUserRequest extends CreateUserRequest {
  id: string
}
