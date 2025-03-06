import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  subscribeToNewsletter(email: string) {
    // This would typically call a service to handle the newsletter subscription
    console.log('Newsletter subscription for:', email);
    // TODO: Implement actual newsletter subscription functionality
  }
}
