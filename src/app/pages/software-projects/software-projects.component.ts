import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';

interface SoftwareProject {
  name: string;
  site: string;
  source: string;
  package: string;
  description: string;
}

@Component({
  selector: 'software-projects-page',
  standalone: true,
  imports: [NgFor, AsyncPipe],
  template: `
    <h2>Software Projects</h2>
    <div class="tile-collection" *ngIf="projects$ | async as projects">
      <article class="tile-item" *ngFor="let project of projects">
        <h3 class="tile-title"><a [href]="project.site">{{ project.name }}</a></h3>
        <div class="tile-menu">
          <a [href]="project.source" aria-label="Source">Source</a>
          <a [href]="project.site" aria-label="Site">Site</a>
          <a [href]="project.package" aria-label="Package">Package</a>
        </div>
        <p class="tile-description">{{ project.description }}</p>
      </article>
    </div>
  `
})
export class SoftwareProjectsComponent {
  private readonly http = inject(HttpClient);
  readonly projects$ = this.http.get<SoftwareProject[]>('/assets/softwareprojects.json');
}
