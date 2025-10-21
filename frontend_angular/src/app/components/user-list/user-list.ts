import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBar } from "@angular/material/snack-bar"
import { UsersService } from "../../services/users.service"
import type { User } from "../../interfaces/user.interface"

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="user-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Lista de Usuarios</mat-card-title>
          <div class="spacer"></div>
          <a mat-raised-button color="primary" routerLink="/users/new">
            <mat-icon>person_add</mat-icon>
            Nuevo Usuario
          </a>
        </mat-card-header>

        <mat-card-content>
          @if (usersService.loading()) {
            <div class="loading-container">
              <mat-spinner></mat-spinner>
              <p>Cargando usuarios...</p>
            </div>
          } @else if (usersService.error()) {
            <div class="error-container">
              <mat-icon color="warn">error</mat-icon>
              <p>{{ usersService.error() }}</p>
              <button mat-button color="primary" (click)="loadUsers()">
                Reintentar
              </button>
            </div>
          } @else {
            @if (usersService.users().length > 0) {
              <table mat-table [dataSource]="usersService.users()" class="users-table">
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>ID</th>
                  <td mat-cell *matCellDef="let user">{{ user.id }}</td>
                </ng-container>

                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Nombre</th>
                  <td mat-cell *matCellDef="let user">{{ user.name }}</td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let user">{{ user.email }}</td>
                </ng-container>

                <ng-container matColumnDef="role">
                  <th mat-header-cell *matHeaderCellDef>Rol</th>
                  <td mat-cell *matCellDef="let user">
                    <span class="role-badge" [class]="'role-' + user.role">
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Acciones</th>
                  <td mat-cell *matCellDef="let user">
                    <div class="actions">
                      <a mat-icon-button color="primary" [routerLink]="['/users/edit', user.id]">
                        <mat-icon>edit</mat-icon>
                      </a>
                      <button mat-icon-button color="warn" (click)="deleteUser(user)">
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
                <mat-icon>people_outline</mat-icon>
                <h3>No hay usuarios registrados</h3>
                <p>Comienza creando tu primer usuario</p>
                <a mat-raised-button color="primary" routerLink="/users/new">
                  Crear Usuario
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
    .user-list-container {
      max-width: 1200px;
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

    .users-table {
      width: 100%;
    }

    .role-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .role-admin { background-color: #ffcdd2; color: #c62828; }
    .role-support { background-color: #fff3e0; color: #f57c00; }
    .role-user { background-color: #e8f5e8; color: #388e3c; }

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
export class UserListComponent implements OnInit {
  usersService = inject(UsersService)
  private snackBar = inject(MatSnackBar)

  displayedColumns: string[] = ["id", "name", "email", "role", "actions"]

  ngOnInit() {
    this.loadUsers()
  }

  loadUsers() {
    this.usersService.getUsers().subscribe()
  }

  deleteUser(user: User) {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.name}"?`)) {
      this.usersService.deleteUser(user.id!).subscribe({
        next: () => {
          this.snackBar.open("Usuario eliminado correctamente", "Cerrar", {
            duration: 3000,
          })
        },
        error: () => {
          this.snackBar.open("Error al eliminar usuario", "Cerrar", {
            duration: 3000,
          })
        },
      })
    }
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      admin: "Administrador",
      support: "Soporte",
      user: "Usuario",
    }
    return labels[role] || role
  }
}
