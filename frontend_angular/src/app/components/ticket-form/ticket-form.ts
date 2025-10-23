import { Component, type OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TicketsService } from "../../services/tickets.service";
import { UsersService } from "../../services/users.service";
import type { Ticket } from "../../interfaces/ticket.interface";

@Component({
  selector: "app-ticket-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./ticket-form.html",
  styleUrls: ["./ticket-form.css"],
})
export class TicketFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ticketsService = inject(TicketsService);
  usersService = inject(UsersService);
  private snackBar = inject(MatSnackBar);

  ticketForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  ticketId: number | null = null;
  supportUsers = signal<any[]>([]);

  constructor() {
    this.ticketForm = this.fb.group({
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      priority: ["medium", [Validators.required]],
      status: ["open"],
      user_id: ["", [Validators.required]],
      assigned_to: [null],
    });
  }

  ngOnInit() {
    this.loadUsers();

    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.ticketId = +id;
      this.isEditMode.set(true);
      this.loadTicket(this.ticketId);
    }
  }

  loadUsers() {
    this.usersService.getUsers().subscribe(() => {
      const users = this.usersService.users();
      this.supportUsers.set(users.filter((u) => u.role === "support" || u.role === "admin"));
    });
  }

  loadTicket(id: number) {
    this.loading.set(true);
    this.ticketsService.getTicketById(id).subscribe({
      next: (ticket: Ticket) => {
        this.ticketForm.patchValue({
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          user_id: ticket.user_id,
          assigned_to: ticket.assigned_to,
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error("Error loading ticket:", error);
        this.snackBar.open("Error al cargar ticket", "Cerrar", { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  onSubmit() {
    if (!this.ticketForm.valid) return;

    this.loading.set(true);
    const formValue = this.ticketForm.value;
    if (formValue.assigned_to === null) delete formValue.assigned_to;

    if (this.isEditMode() && this.ticketId) {
      const updateData = { ...formValue, id: this.ticketId };
      this.ticketsService.updateTicket(updateData).subscribe({
        next: () => {
          this.snackBar.open("Ticket actualizado correctamente", "Cerrar", { duration: 3000 });
          this.router.navigate(["/tickets"]);
        },
        error: (error) => {
          console.error("Error updating ticket:", error);
          this.snackBar.open("Error al actualizar ticket", "Cerrar", { duration: 3000 });
          this.loading.set(false);
        },
      });
    } else {
      this.ticketsService.createTicket(formValue).subscribe({
        next: () => {
          this.snackBar.open("Ticket creado correctamente", "Cerrar", { duration: 3000 });
          this.router.navigate(["/tickets"]);
        },
        error: (error) => {
          console.error("Error creating ticket:", error);
          this.snackBar.open("Error al crear ticket", "Cerrar", { duration: 3000 });
          this.loading.set(false);
        },
      });
    }
  }

  goBack() {
    this.router.navigate(["/tickets"]);
  }
}
