import { Component, type OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatChipsModule } from "@angular/material/chips";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TicketsService } from "../../services/tickets.service";
import type { Ticket } from "../../interfaces/ticket.interface";

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
  templateUrl: "./ticket-list.html",
  styleUrls: ["./ticket-list.css"],
})
export class TicketListComponent implements OnInit {
  ticketsService = inject(TicketsService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ["id", "title", "status", "priority", "user", "created_at", "actions"];

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketsService.getTickets().subscribe();
  }

  deleteTicket(ticket: Ticket) {
    if (confirm(`¿Estás seguro de que quieres eliminar el ticket "${ticket.title}"?`)) {
      this.ticketsService.deleteTicket(ticket.id!).subscribe({
        next: () => {
          this.snackBar.open("Ticket eliminado correctamente", "Cerrar", { duration: 3000 });
        },
        error: () => {
          this.snackBar.open("Error al eliminar ticket", "Cerrar", { duration: 3000 });
        },
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      open: "Abierto",
      in_progress: "En Progreso",
      closed: "Cerrado",
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      low: "Baja",
      medium: "Media",
      high: "Alta",
      urgent: "Urgente",
    };
    return labels[priority] || priority;
  }
}
