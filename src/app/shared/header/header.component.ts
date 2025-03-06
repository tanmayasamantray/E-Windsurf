import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  showLoginModal = false;
  cartCount = 0;
  private cartSubscription: Subscription | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  toggleLoginModal() {
    this.showLoginModal = !this.showLoginModal;
  }

  login() {
    this.isLoggedIn = true;
    this.showLoginModal = false;
  }

  logout() {
    this.isLoggedIn = false;
  }
}
