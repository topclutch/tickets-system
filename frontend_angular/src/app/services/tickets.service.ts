import { Injectable, inject, signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, tap, map } from "rxjs"
import type { Ticket, CreateTicketRequest, UpdateTicketRequest } from "../interfaces/ticket.interface"

@Injectable({
  providedIn: "root",
})
export class TicketsService {
  private http = inject(HttpClient)
  private apiUrl = "http://localhost:5000/api/tickets"

  // Signals para estado reactivo
  tickets = signal<Ticket[]>([])
  loading = signal<boolean>(false)
  error = signal<string | null>(null)

  private mapTicket(t: any): Ticket {
    return {
      id: t._id,
      title: t.titulo,
      description: t.descripcion,
      status: t.estado,
      priority: t.prioridad,
      user_id: t.usuario_id,
      created_at: t.fecha_creacion,
      updated_at: t.fecha_actualizacion,
      //user: null, // opcional: puedes extender si el backend lo incluye
    }
  }

  getTickets(): Observable<Ticket[]> {
    this.loading.set(true)
    this.error.set(null)

    return this.http.get<{ success: boolean; data: any[] }>(this.apiUrl).pipe(
      map(res => res.data.map(this.mapTicket)),
      tap({
        next: (mappedTickets) => {
          this.tickets.set(mappedTickets)
          this.loading.set(false)
        },
        error: (error) => {
          this.error.set("Error al cargar tickets")
          this.loading.set(false)
          console.error("Error fetching tickets:", error)
        },
      })
    )
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/${id}`).pipe(
      map(res => this.mapTicket(res.data))
    )
  }

  createTicket(ticket: CreateTicketRequest): Observable<Ticket> {
    this.loading.set(true)
    return this.http.post<{ success: boolean; data: any }>(this.apiUrl, ticket).pipe(
      map(res => this.mapTicket(res.data)),
      tap({
        next: (newTicket) => {
          this.tickets.update(tickets => [...tickets, newTicket])
          this.loading.set(false)
        },
        error: (error) => {
          this.error.set("Error al crear ticket")
          this.loading.set(false)
          console.error("Error creating ticket:", error)
        },
      })
    )
  }

  updateTicket(ticket: UpdateTicketRequest): Observable<Ticket> {
    this.loading.set(true)
    return this.http.put<{ success: boolean; data: any }>(`${this.apiUrl}/${ticket.id}`, ticket).pipe(
      map(res => this.mapTicket(res.data)),
      tap({
        next: (updatedTicket) => {
          this.tickets.update(tickets =>
            tickets.map(t => (t.id === updatedTicket.id ? updatedTicket : t))
          )
          this.loading.set(false)
        },
        error: (error) => {
          this.error.set("Error al actualizar ticket")
          this.loading.set(false)
          console.error("Error updating ticket:", error)
        },
      })
    )
  }

  deleteTicket(id: number): Observable<void> {
    this.loading.set(true)
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          this.tickets.update(tickets => tickets.filter(t => t.id !== id))
          this.loading.set(false)
        },
        error: (error) => {
          this.error.set("Error al eliminar ticket")
          this.loading.set(false)
          console.error("Error deleting ticket:", error)
        },
      }),
      map(() => void 0)
    )
  }

  getTicketStats(): Observable<any> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/stats`).pipe(
      map(res => res.data)
    )
  }
}
