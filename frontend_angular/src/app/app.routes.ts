import type { Routes } from "@angular/router"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    loadComponent: () => import("./components/dashboard/dashboard").then((c) => c.DashboardComponent),
  },
  {
    path: "users",
    loadComponent: () => import("./components/user-list/user-list").then((c) => c.UserListComponent),
  },
  {
    path: "users/new",
    loadComponent: () => import("./components/user-form/user-form").then((c) => c.UserFormComponent),
  },
  {
    path: "users/edit/:id",
    loadComponent: () => import("./components/user-form/user-form").then((c) => c.UserFormComponent),
  },
  {
    path: "tickets",
    loadComponent: () => import("./components/ticket-list/ticket-list").then((c) => c.TicketListComponent),
  },
  {
    path: "tickets/new",
    loadComponent: () => import("./components/ticket-form/ticket-form").then((c) => c.TicketFormComponent),
  },
  {
    path: "tickets/edit/:id",
    loadComponent: () => import("./components/ticket-form/ticket-form").then((c) => c.TicketFormComponent),
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
]
