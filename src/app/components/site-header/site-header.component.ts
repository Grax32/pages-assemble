import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <h1>Art • Science • Love</h1>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <a routerLink="/software-projects" routerLinkActive="active">Software Projects</a>
        <a routerLink="/contact" routerLinkActive="active">Contact</a>
      </nav>
    </header>
  `,
  styles: [
    `
      .site-header {
        border-bottom: 1px solid #ddd;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
      }

      nav {
        display: flex;
        gap: 1rem;
      }

      a.active {
        font-weight: 700;
      }
    `
  ]
})
export class SiteHeaderComponent {}
