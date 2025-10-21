// src/app/components/header/header.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h2>🎫 Sistema de Tickets</h2>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active">📊 Dashboard</a>
        <a routerLink="/users" routerLinkActive="active">👥 Usuarios</a>
        <a routerLink="/tickets" routerLinkActive="active">🎫 Tickets</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #3f51b5;
      color: white;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-brand h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .nav-links {
      display: flex;
      gap: 20px;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .nav-links a:hover,
    .nav-links a.active {
      background-color: rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 15px;
      }
      
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  `]
})
export class HeaderComponent {}