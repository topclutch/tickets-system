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
import { UsersService } from "../../services/users.service"
import type { User } from "../../interfaces/user.interface"

@Component({
  selector: "app-user-form",
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
    <div class="user-form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            @if (isEditMode()) {
              Editar Usuario
            } @else {
              Nuevo Usuario
            }
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="name" placeholder="Ingresa el nombre">
                @if (userForm.get('name')?.hasError('required') && userForm.get('name')?.touched) {
                  <mat-error>El nombre es requerido</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="usuario@ejemplo.com">
                @if (userForm.get('email')?.hasError('required') && userForm.get('email')?.touched) {
                  <mat-error>El email es requerido</mat-error>
                }
                @if (userForm.get('email')?.hasError('email') && userForm.get('email')?.touched) {
                  <mat-error>Ingresa un email válido</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Rol</mat-label>
                <mat-select formControlName="role">
                  <mat-option value="user">Usuario</mat-option>
                  <mat-option value="support">Soporte</mat-option>
                  <mat-option value="admin">Administrador</mat-option>
                </mat-select>
                @if (userForm.get('role')?.hasError('required') && userForm.get('role')?.touched) {
                  <mat-error>El rol es requerido</mat-error>
                }
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
            [disabled]="userForm.invalid || loading()">
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
    .user-form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-row {
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    mat-card-actions {
      padding: 16px 24px;
      margin: 0;
    }
  `,
  ],
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private usersService = inject(UsersService)
  private snackBar = inject(MatSnackBar)

  userForm: FormGroup
  isEditMode = signal(false)
  loading = signal(false)
  userId: string | null = null  // <-- Cambiado a string | null

  constructor() {
    this.userForm = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      role: ["user", [Validators.required]],
    })
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.userId = id  // <-- Ya es string, no hacer +id
      this.isEditMode.set(true)
      this.loadUser(this.userId)
    }
  }

  loadUser(id: string) {  // <-- Cambiado a string
    this.loading.set(true)
    this.usersService.getUserById(id).subscribe({
      next: (user: User) => {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
        })
        this.loading.set(false)
      },
      error: (error) => {
        console.error("Error loading user:", error)
        this.snackBar.open("Error al cargar usuario", "Cerrar", {
          duration: 3000,
        })
        this.loading.set(false)
      },
    })
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading.set(true)
      const formValue = this.userForm.value

      if (this.isEditMode() && this.userId) {
        const updateData = { ...formValue, id: this.userId }  // <-- id string
        this.usersService.updateUser(updateData).subscribe({
          next: () => {
            this.snackBar.open("Usuario actualizado correctamente", "Cerrar", {
              duration: 3000,
            })
            this.router.navigate(["/users"])
          },
          error: (error) => {
            console.error("Error updating user:", error)
            this.snackBar.open("Error al actualizar usuario", "Cerrar", {
              duration: 3000,
            })
            this.loading.set(false)
          },
        })
      } else {
        this.usersService.createUser(formValue).subscribe({
          next: () => {
            this.snackBar.open("Usuario creado correctamente", "Cerrar", {
              duration: 3000,
            })
            this.router.navigate(["/users"])
          },
          error: (error) => {
            console.error("Error creating user:", error)
            this.snackBar.open("Error al crear usuario", "Cerrar", {
              duration: 3000,
            })
            this.loading.set(false)
          },
        })
      }
    }
  }

  goBack() {
    this.router.navigate(["/users"])
  }
}
