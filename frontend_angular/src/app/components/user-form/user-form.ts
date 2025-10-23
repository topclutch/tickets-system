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
import { UsersService } from "../../services/users.service";
import type { User } from "../../interfaces/user.interface";

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
  templateUrl: "./user-form.html",
  styleUrls: ["./user-form.css"],
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private snackBar = inject(MatSnackBar);

  userForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  userId: string | null = null;

  constructor() {
    this.userForm = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      role: ["user", [Validators.required]],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.userId = id;
      this.isEditMode.set(true);
      this.loadUser(this.userId);
    }
  }

  loadUser(id: string) {
    this.loading.set(true);
    this.usersService.getUserById(id).subscribe({
      next: (user: User) => {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error("Error loading user:", error);
        this.snackBar.open("Error al cargar usuario", "Cerrar", { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  onSubmit() {
    if (!this.userForm.valid) return;

    this.loading.set(true);
    const formValue = this.userForm.value;

    if (this.isEditMode() && this.userId) {
      const updateData = { ...formValue, id: this.userId };
      this.usersService.updateUser(updateData).subscribe({
        next: () => {
          this.snackBar.open("Usuario actualizado correctamente", "Cerrar", { duration: 3000 });
          this.router.navigate(["/users"]);
        },
        error: () => {
          this.snackBar.open("Error al actualizar usuario", "Cerrar", { duration: 3000 });
          this.loading.set(false);
        },
      });
    } else {
      this.usersService.createUser(formValue).subscribe({
        next: () => {
          this.snackBar.open("Usuario creado correctamente", "Cerrar", { duration: 3000 });
          this.router.navigate(["/users"]);
        },
        error: () => {
          this.snackBar.open("Error al crear usuario", "Cerrar", { duration: 3000 });
          this.loading.set(false);
        },
      });
    }
  }

  goBack() {
    this.router.navigate(["/users"]);
  }
}
