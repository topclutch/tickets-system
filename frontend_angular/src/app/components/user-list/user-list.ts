import { Component, type OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UsersService } from "../../services/users.service";
import type { User } from "../../interfaces/user.interface";

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
  templateUrl: "./user-list.html",
  styleUrls: ["./user-list.css"],
})
export class UserListComponent implements OnInit {
  usersService = inject(UsersService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ["id", "name", "email", "role", "actions"];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe();
  }

  deleteUser(user: User) {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.name}"?`)) {
      this.usersService.deleteUser(user.id!).subscribe({
        next: () => {
          this.snackBar.open("Usuario eliminado correctamente", "Cerrar", { duration: 3000 });
        },
        error: () => {
          this.snackBar.open("Error al eliminar usuario", "Cerrar", { duration: 3000 });
        },
      });
    }
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      admin: "Administrador",
      support: "Soporte",
      user: "Usuario",
    };
    return labels[role] || role;
  }
}
