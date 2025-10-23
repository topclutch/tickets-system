import { Component } from "@angular/core"
import { MatToolbarModule } from "@angular/material/toolbar"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [MatToolbarModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <span class="footer-brand">TicketFlow</span>
            <span class="footer-tagline">Modern ticket management</span>
          </div>
          <div class="footer-section">
            <span class="footer-text">Built with Angular 20</span>
            <span class="footer-version">v1.0.0</span>
          </div>
        </div>
        <div class="footer-bottom">
          <span class="copyright">© 2025 TicketFlow. All rights reserved.</span>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
    .footer {
      background: linear-gradient(to right, #f8fafc, #f1f5f9);
      border-top: 1px solid #e2e8f0;
      margin-top: auto;
    }
    
    .footer-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 24px 24px;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 20px;
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .footer-brand {
      font-weight: 700;
      font-size: 1.125rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .footer-tagline {
      font-size: 0.875rem;
      color: #64748b;
    }

    .footer-text {
      font-size: 0.875rem;
      color: #475569;
      font-weight: 500;
    }

    .footer-version {
      font-size: 0.75rem;
      color: #94a3b8;
      font-family: 'Courier New', monospace;
    }

    .footer-bottom {
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
    }

    .copyright {
      font-size: 0.875rem;
      color: #64748b;
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `,
  ],
})
export class FooterComponent {}
