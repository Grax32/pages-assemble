import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './components/site-header/site-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent],
  template: `
    <site-header />
    <main class="page-content">
      <router-outlet />
    </main>
  `
})
export class AppComponent {}
