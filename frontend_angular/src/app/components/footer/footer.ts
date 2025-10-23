import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule],
  template: `
    <mat-toolbar class="footer">
      <span>© 2024 Sistema de Tickets - Desarrollado con Angular 20</span>
      <div class="spacer"></div>
      <span>v1.0.0</span>
    </mat-toolbar>
  `,
  styles: [`
    .footer {
      background-color: #f5f5f5;
      color: #666;
      font-size: 14px;
      min-height: 48px;
      border-top: 1px solid #e0e0e0;
    }
    
    .spacer {
      flex: 1;
    }
  `]
})
export class FooterComponent {}