import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatChipsModule } from "@angular/material/chips"
import { MatSnackBar } from "@angular/material/snack-bar"
import { TicketsService } from "../../services/tickets.service"
import type { Ticket } from "../../interfaces/ticket.interface"

@Component({
  selector: "app-ticket-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  template: `
    <div class="ticket-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Lista de Tickets</mat-card-title>
          <div class="spacer"></div>
          <a mat-raised-button color="primary" routerLink="/tickets/new">
            <mat-icon>add</mat-icon>
            Nuevo Ticket
          </a>
        </mat-card-header>

        <mat-card-content>
          @if (ticketsService.loading()) {
            <div class="loading-container">
              <mat-spinner></mat-spinner>
              <p>Cargando tickets...</p>
            </div>
          } @else if (ticketsService.error()) {
            <div class="error-container">
              <mat-icon color="warn">error</mat-icon>
              <p>{{ ticketsService.error() }}</p>
              <button mat-button color="primary" (click)="loadTickets()">
                Reintentar
              </button>
            </div>
          } @else {
            @if (ticketsService.tickets().length > 0) {
              <table mat-table [dataSource]="ticketsService.tickets()" class="tickets-table">
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>ID</th>
                  <td mat-cell *matCellDef="let ticket">{{ ticket.id }}</td>
                </ng-container>

                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef>Título</th>
                  <td mat-cell *matCellDef="let ticket">
                    <div class="ticket-title">
                      {{ ticket.title }}
                      <small>{{ ticket.description | slice:0:50 }}...</small>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let ticket">
                    <mat-chip [class]="'status-' + ticket.status">
                      {{ getStatusLabel(ticket.status) }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="priority">
                  <th mat-header-cell *matHeaderCellDef>Prioridad</th>
                  <td mat-cell *matCellDef="let ticket">
                    <mat-chip [class]="'priority-' + ticket.priority">
                      {{ getPriorityLabel(ticket.priority) }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="user">
                  <th mat-header-cell *matHeaderCellDef>Usuario</th>
                  <td mat-cell *matCellDef="let ticket">
                    @if (ticket.user) {
                      {{ ticket.user.name }}
                    } @else {
                      Usuario #{{ ticket.user_id }}
                    }
                  </td>
                </ng-container>

                <ng-container matColumnDef="created_at">
                  <th mat-header-cell *matHeaderCellDef>Creado</th>
                  <td mat-cell *matCellDef="let ticket">
                    {{ ticket.created_at | date:'short' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Acciones</th>
                  <td mat-cell *matCellDef="let ticket">
                    <div class="actions">
                      <a mat-icon-button color="primary" [routerLink]="['/tickets/edit', ticket.id]">
                        <mat-icon>edit</mat-icon>
                      </a>
                      <button mat-icon-button color="warn" (click)="deleteTicket(ticket)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            } @else {
              <div class="empty-state">
                <mat-icon>confirmation_number</mat-icon>
                <h3>No hay tickets registrados</h3>
                <p>Comienza creando tu primer ticket</p>
                <a mat-raised-button color="primary" routerLink="/tickets/new">
                  Crear Ticket
                </a>
              </div>
            }
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .ticket-list-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    mat-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .spacer {
      flex: 1;
    }

    .tickets-table {
      width: 100%;
    }

    .ticket-title {
      display: flex;
      flex-direction: column;
    }

    .ticket-title small {
      color: #666;
      font-size: 12px;
      margin-top: 4px;
    }

    mat-chip {
      font-size: 11px;
      min-height: 24px;
    }

    .status-open { background-color: #e3f2fd; color: #1976d2; }
    .status-in_progress { background-color: #fff3e0; color: #f57c00; }
    .status-closed { background-color: #e8f5e8; color: #388e3c; }

    .priority-low { background-color: #f3e5f5; color: #7b1fa2; }
    .priority-medium { background-color: #fff3e0; color: #f57c00; }
    .priority-high { background-color: #ffebee; color: #d32f2f; }
    .priority-urgent { background-color: #ffcdd2; color: #c62828; }

    .actions {
      display: flex;
      gap: 8px;
    }

    .loading-container,
    .error-container,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      text-align: center;
    }

    .loading-container mat-spinner {
      margin-bottom: 20px;
    }

    .error-container mat-icon,
    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 16px 0 8px 0;
      color: #666;
    }

    .empty-state p {
      margin-bottom: 24px;
      color: #999;
    }
  `,
  ],
})
export class TicketListComponent implements OnInit {
  ticketsService = inject(TicketsService)
  private snackBar = inject(MatSnackBar)

  displayedColumns: string[] = ["id", "title", "status", "priority", "user", "created_at", "actions"]

  ngOnInit() {
    this.loadTickets()
  }

  loadTickets() {
    this.ticketsService.getTickets().subscribe()
  }

  deleteTicket(ticket: Ticket) {
    if (confirm(`¿Estás seguro de que quieres eliminar el ticket "${ticket.title}"?`)) {
      this.ticketsService.deleteTicket(ticket.id!).subscribe({
        next: () => {
          this.snackBar.open("Ticket eliminado correctamente", "Cerrar", {
            duration: 3000,
          })
        },
        error: () => {
          this.snackBar.open("Error al eliminar ticket", "Cerrar", {
            duration: 3000,
          })
        },
      })
    }
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
