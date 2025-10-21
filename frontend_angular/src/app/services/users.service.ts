import { Injectable, inject, signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, tap, map } from "rxjs"
import type { User, CreateUserRequest, UpdateUserRequest } from "../interfaces/user.interface"

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private http = inject(HttpClient)
  private apiUrl = "http://localhost:5000/api/users"

  users = signal<User[]>([])
  loading = signal<boolean>(false)
  error = signal<string | null>(null)

  // Mapa de rol_id a role
  private roleMap: Record<string, User["role"]> = {
    "6860c001851ffea2f4a02916": "admin",
    "6860c001851ffea2f4a02917": "support",
    "6860c001851ffea2f4a02918": "user",
  }

  // Función para mapear la respuesta cruda al objeto User
  private mapUserApiResponse(u: any): User {
    return {
      id: u._id,
      name: u.nombre,
      email: u.email,
      telefono: u.telefono,
      role: this.roleMap[u.rol_id] || "user",
      created_at: u.fecha_registro?.$date,
      updated_at: u.fecha_actualizacion?.$date,
    }
  }

  getUsers(): Observable<User[]> {
    this.loading.set(true)
    this.error.set(null)
    return this.http.get<{ success: boolean; data: any[] }>(this.apiUrl).pipe(
      map(res => res.data.map(u => this.mapUserApiResponse(u))),
      tap({
        next: (users) => {
          this.users.set(users)
          this.loading.set(false)
        },
        error: (error) => {
          this.error.set("Error al cargar usuarios")
          this.loading.set(false)
          console.error("Error fetching users:", error)
        },
      }),
    )
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/${id}`).pipe(
      map(res => this.mapUserApiResponse(res.data))
    )
  }

  createUser(user: CreateUserRequest): Observable<User> {
    this.loading.set(true)
    return this.http.post<{ success: boolean; data: any }>(this.apiUrl, user).pipe(
      map(res => this.mapUserApiResponse(res.data)),
      tap({
        next: (newUser) => {
          this.users.update(users => [...users, newUser])
          this.loading.set(false)
        },
        error: (error) => {
          this.error.set("Error al crear usuario")
          this.loading.set(false)
          console.error("Error creating user:", error)
        },
      }),
    )
  }

  updateUser(user: UpdateUserRequest): Observable<User> {
    this.loading.set(true)
    return this.http.put<{ success: boolean; data: any }>(`${this.apiUrl}/${user.id}`, user).pipe(
      map(res => this.mapUserApiResponse(res.data)),
      tap({
        next: (updatedUser) => {
          this.users.update(users =>
            users.map(u => (u.id === updatedUser.id ? updatedUser : u))
          )
          this.loading.set(false)
        },
        error: (error) => {
          this.error.set("Error al actualizar usuario")
          this.loading.set(false)
          console.error("Error updating user:", error)
        },
      }),
    )
  }

  deleteUser(id: string): Observable<void> {
    this.loading.set(true)
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          this.users.update(users => users.filter(u => u.id !== id))
          this.loading.set(false)
        },
        error: (error) => {
          this.error.set("Error al eliminar usuario")
          this.loading.set(false)
          console.error("Error deleting user:", error)
        },
      }),
      map(() => void 0) // Para que el observable devuelva void
    )
  }
}
