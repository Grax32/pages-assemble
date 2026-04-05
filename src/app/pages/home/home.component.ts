import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section>
      <h2>Art</h2>
      <p>
        As an artist, I want to make and share artwork that touches your heart and soul.
        Explore the gallery and discover work made to inspire and connect.
      </p>
    </section>

    <section>
      <h2>Science</h2>
      <p>
        As a software developer, I share practical lessons and technical writeups.
      </p>
      <p>
        <a href="/articles/tech/">Tech Articles</a> •
        <a routerLink="/software-projects">Software Projects</a>
      </p>
    </section>

    <section>
      <h2>Love</h2>
      <p>
        As a human, I aim to support understanding across perspectives and cultivate empathy.
      </p>
    </section>
  `
})
export class HomeComponent {}
