import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { TicketsService } from "../../services/tickets.service";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard.css"]
})
export class DashboardComponent implements OnInit {
  ticketsService = inject(TicketsService);
  usersService = inject(UsersService);

  openTickets = signal(0);
  inProgressTickets = signal(0);
  recentTickets = signal<any[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.ticketsService.getTickets().subscribe(() => {
      const tickets = this.ticketsService.tickets();
      this.openTickets.set(tickets.filter((t) => t.status === "open").length);
      this.inProgressTickets.set(tickets.filter((t) => t.status === "in_progress").length);
      this.recentTickets.set(tickets.slice(0, 5));
    });

    this.usersService.getUsers().subscribe();
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
