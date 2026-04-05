import { Component } from '@angular/core';

@Component({
  selector: 'contact-page',
  standalone: true,
  template: `
    <section class="contact-form-container">
      <h2>Contact Me</h2>
      <p>If you have questions, comments, or want to get in touch, please use the form below:</p>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSch1zQFZgToYdGGD33QbRdovDymrfbUtr2WBa5rsyNoeClXPA/viewform?embedded=true"
        width="100%"
        height="752"
        title="Contact Form"
        style="border:none; background:transparent;"
        loading="lazy"
      >
        Loading…
      </iframe>
    </section>
  `
})
export class ContactComponent {}
