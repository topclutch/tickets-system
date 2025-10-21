import { Component, type OnInit, inject, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { RouterLink } from "@angular/router"
import { TicketsService } from "../../services/tickets.service"
import { UsersService } from "../../services/users.service"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>confirmation_number</mat-icon>
            <mat-card-title>Total Tickets</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ ticketsService.tickets().length }}</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button routerLink="/tickets">Ver Todos</a>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>people</mat-icon>
            <mat-card-title>Total Usuarios</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ usersService.users().length }}</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button routerLink="/users">Ver Todos</a>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">priority_high</mat-icon>
            <mat-card-title>Tickets Abiertos</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ openTickets() }}</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button routerLink="/tickets">Ver Abiertos</a>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="accent">trending_up</mat-icon>
            <mat-card-title>En Progreso</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ inProgressTickets() }}</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button routerLink="/tickets">Ver En Progreso</a>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="recent-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Tickets Recientes</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (ticketsService.tickets().length > 0) {
              <div class="recent-tickets">
                @for (ticket of recentTickets(); track ticket.id) {
                  <div class="ticket-item">
                    <div class="ticket-info">
                      <h4>{{ ticket.title }}</h4>
                      <p>{{ ticket.description | slice:0:100 }}...</p>
                      <div class="ticket-meta">
                        <span class="status" [class]="'status-' + ticket.status">
                          {{ getStatusLabel(ticket.status) }}
                        </span>
                        <span class="priority" [class]="'priority-' + ticket.priority">
                          {{ getPriorityLabel(ticket.priority) }}
                        </span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p>No hay tickets recientes</p>
            }
          </mat-card-content>
          <mat-card-actions>
            <a mat-button routerLink="/tickets/new">Crear Nuevo Ticket</a>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      margin-bottom: 30px;
      color: #333;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #3f51b5;
      margin: 10px 0;
    }

    .recent-section {
      margin-top: 30px;
    }

    .recent-tickets {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .ticket-item {
      padding: 15px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #fafafa;
    }

    .ticket-info h4 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .ticket-info p {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
    }

    .ticket-meta {
      display: flex;
      gap: 10px;
    }

    .status, .priority {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-open { background-color: #e3f2fd; color: #1976d2; }
    .status-in_progress { background-color: #fff3e0; color: #f57c00; }
    .status-closed { background-color: #e8f5e8; color: #388e3c; }

    .priority-low { background-color: #f3e5f5; color: #7b1fa2; }
    .priority-medium { background-color: #fff3e0; color: #f57c00; }
    .priority-high { background-color: #ffebee; color: #d32f2f; }
    .priority-urgent { background-color: #ffcdd2; color: #c62828; }
  `,
  ],
})
export class DashboardComponent implements OnInit {
  ticketsService = inject(TicketsService)
  usersService = inject(UsersService)

  openTickets = signal(0)
  inProgressTickets = signal(0)
  recentTickets = signal<any[]>([])

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.ticketsService.getTickets().subscribe(() => {
      const tickets = this.ticketsService.tickets()
      this.openTickets.set(tickets.filter((t) => t.status === "open").length)
      this.inProgressTickets.set(tickets.filter((t) => t.status === "in_progress").length)
      this.recentTickets.set(tickets.slice(0, 5))
    })

    this.usersService.getUsers().subscribe()
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      open: "Abierto",
      in_progress: "En Progreso",
      closed: "Cerrado",
    }
    return labels[status] || status
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      low: "Baja",
      medium: "Media",
      high: "Alta",
      urgent: "Urgente",
    }
    return labels[priority] || priority
  }
}
