import { Component, type OnInit, inject, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatSnackBar } from "@angular/material/snack-bar"
import { TicketsService } from "../../services/tickets.service"
import { UsersService } from "../../services/users.service"
import type { Ticket } from "../../interfaces/ticket.interface"

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
  template: `
    <div class="ticket-form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            @if (isEditMode()) {
              Editar Ticket
            } @else {
              Nuevo Ticket
            }
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="ticketForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Título</mat-label>
                <input matInput formControlName="title" placeholder="Ingresa el título del ticket">
                @if (ticketForm.get('title')?.hasError('required') && ticketForm.get('title')?.touched) {
                  <mat-error>El título es requerido</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descripción</mat-label>
                <textarea 
                  matInput 
                  formControlName="description" 
                  placeholder="Describe el problema o solicitud"
                  rows="4">
                </textarea>
                @if (ticketForm.get('description')?.hasError('required') && ticketForm.get('description')?.touched) {
                  <mat-error>La descripción es requerida</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row-group">
              <mat-form-field appearance="outline">
                <mat-label>Prioridad</mat-label>
                <mat-select formControlName="priority">
                  <mat-option value="low">Baja</mat-option>
                  <mat-option value="medium">Media</mat-option>
                  <mat-option value="high">Alta</mat-option>
                  <mat-option value="urgent">Urgente</mat-option>
                </mat-select>
                @if (ticketForm.get('priority')?.hasError('required') && ticketForm.get('priority')?.touched) {
                  <mat-error>La prioridad es requerida</mat-error>
                }
              </mat-form-field>

              @if (isEditMode()) {
                <mat-form-field appearance="outline">
                  <mat-label>Estado</mat-label>
                  <mat-select formControlName="status">
                    <mat-option value="open">Abierto</mat-option>
                    <mat-option value="in_progress">En Progreso</mat-option>
                    <mat-option value="closed">Cerrado</mat-option>
                  </mat-select>
                </mat-form-field>
              }
            </div>

            <div class="form-row-group">
              <mat-form-field appearance="outline">
                <mat-label>Usuario</mat-label>
                <mat-select formControlName="user_id">
                  @for (user of usersService.users(); track user.id) {
                    <mat-option [value]="user.id">{{ user.name }} ({{ user.email }})</mat-option>
                  }
                </mat-select>
                @if (ticketForm.get('user_id')?.hasError('required') && ticketForm.get('user_id')?.touched) {
                  <mat-error>El usuario es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Asignado a</mat-label>
                <mat-select formControlName="assigned_to">
                  <mat-option [value]="null">Sin asignar</mat-option>
                  @for (user of supportUsers(); track user.id) {
                    <mat-option [value]="user.id">{{ user.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button type="button" (click)="goBack()">
            Cancelar
          </button>
          <button 
            mat-raised-button 
            color="primary" 
            (click)="onSubmit()"
            [disabled]="ticketForm.invalid || loading()">
            @if (loading()) {
              Guardando...
            } @else if (isEditMode()) {
              Actualizar
            } @else {
              Crear
            }
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .ticket-form-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-row {
      margin-bottom: 16px;
    }

    .form-row-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    mat-card-actions {
      padding: 16px 24px;
      margin: 0;
    }

    @media (max-width: 768px) {
      .form-row-group {
        grid-template-columns: 1fr;
      }
    }
  `,
  ],
})
export class TicketFormComponent implements OnInit {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private ticketsService = inject(TicketsService)
  usersService = inject(UsersService)
  private snackBar = inject(MatSnackBar)

  ticketForm: FormGroup
  isEditMode = signal(false)
  loading = signal(false)
  ticketId: number | null = null
  supportUsers = signal<any[]>([])

  constructor() {
    this.ticketForm = this.fb.group({
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      priority: ["medium", [Validators.required]],
      status: ["open"],
      user_id: ["", [Validators.required]],
      assigned_to: [null],
    })
  }

  ngOnInit() {
    this.loadUsers()

    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.ticketId = +id
      this.isEditMode.set(true)
      this.loadTicket(this.ticketId)
    }
  }

  loadUsers() {
    this.usersService.getUsers().subscribe(() => {
      // Filtrar usuarios de soporte y admin para asignación
      const users = this.usersService.users()
      this.supportUsers.set(users.filter((u) => u.role === "support" || u.role === "admin"))
    })
  }

  loadTicket(id: number) {
    this.loading.set(true)
    this.ticketsService.getTicketById(id).subscribe({
      next: (ticket: Ticket) => {
        this.ticketForm.patchValue({
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          user_id: ticket.user_id,
          assigned_to: ticket.assigned_to,
        })
        this.loading.set(false)
      },
      error: (error) => {
        console.error("Error loading ticket:", error)
        this.snackBar.open("Error al cargar ticket", "Cerrar", {
          duration: 3000,
        })
        this.loading.set(false)
      },
    })
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      this.loading.set(true)
      const formValue = this.ticketForm.value

      // Convertir assigned_to null a undefined para el backend
      if (formValue.assigned_to === null) {
        delete formValue.assigned_to
      }

      if (this.isEditMode() && this.ticketId) {
        const updateData = { ...formValue, id: this.ticketId }
        this.ticketsService.updateTicket(updateData).subscribe({
          next: () => {
            this.snackBar.open("Ticket actualizado correctamente", "Cerrar", {
              duration: 3000,
            })
            this.router.navigate(["/tickets"])
          },
          error: (error) => {
            console.error("Error updating ticket:", error)
            this.snackBar.open("Error al actualizar ticket", "Cerrar", {
              duration: 3000,
            })
            this.loading.set(false)
          },
        })
      } else {
        this.ticketsService.createTicket(formValue).subscribe({
          next: () => {
            this.snackBar.open("Ticket creado correctamente", "Cerrar", {
              duration: 3000,
            })
            this.router.navigate(["/tickets"])
          },
          error: (error) => {
            console.error("Error creating ticket:", error)
            this.snackBar.open("Error al crear ticket", "Cerrar", {
              duration: 3000,
            })
            this.loading.set(false)
          },
        })
      }
    }
  }

  goBack() {
    this.router.navigate(["/tickets"])
  }
}
