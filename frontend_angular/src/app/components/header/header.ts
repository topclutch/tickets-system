<<<<<<< Updated upstream
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
=======
import { Component } from "@angular/core"
import { RouterLink, RouterLinkActive } from "@angular/router"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <svg class="logo-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H9C9.55228 10 10 9.55228 10 9V4C10 3.44772 9.55228 3 9 3Z" stroke="currentColor" stroke-width="2"/>
            <path d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z" stroke="currentColor" stroke-width="2"/>
            <path d="M9 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V15C10 14.4477 9.55228 14 9 14Z" stroke="currentColor" stroke-width="2"/>
            <path d="M20 14H15C14.4477 14 14 14.4477 14 15V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="brand-text">TicketFlow</span>
        </div>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <span class="link-icon">📊</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/tickets" routerLinkActive="active" class="nav-link">
            <span class="link-icon">🎫</span>
            <span>Tickets</span>
          </a>
          <a routerLink="/users" routerLinkActive="active" class="nav-link">
            <span class="link-icon">👥</span>
            <span>Users</span>
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      font-size: 1.25rem;
      letter-spacing: -0.025em;
    }

    .logo-icon {
      color: white;
    }

    .brand-text {
      font-weight: 700;
      background: linear-gradient(to right, #ffffff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      font-size: 0.9375rem;
      position: relative;
    }

    .link-icon {
      font-size: 1.125rem;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }

    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: 600;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -16px;
      left: 50%;
      transform: translateX(-50%);
      width: 40%;
      height: 3px;
      background: white;
      border-radius: 2px 2px 0 0;
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        height: auto;
        padding: 16px 20px;
        gap: 16px;
      }
      
      .nav-links {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }

      .nav-link.active::after {
        display: none;
      }
    }
  `,
  ],
>>>>>>> Stashed changes
})
export class Header {

}
