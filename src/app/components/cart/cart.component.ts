import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  couponCode: string = '';
  discount: number = 0;
  selectedShipping: number = 0;
  shippingOptions: ShippingOption[] = [
    { id: 'free', name: 'Free Shipping', price: 0 },
    { id: 'standard', name: 'Standard Shipping', price: 10 },
    { id: 'express', name: 'Express Shipping', price: 20 }
  ];
  
  private cartSubscription: Subscription | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
    this.selectedShipping = this.shippingOptions[0].price;
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  calculateItemPrice(item: CartItem): number {
    if (item.product.discount) {
      return item.product.price * (1 - item.product.discount / 100);
    }
    return item.product.price;
  }

  calculateSubtotal(item: CartItem): number {
    return this.calculateItemPrice(item) * item.quantity;
  }

  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + this.calculateSubtotal(item);
    }, 0);
  }

  calculateGrandTotal(): number {
    return this.calculateTotal() - this.discount + this.selectedShipping;
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    }
  }

  updateQuantity(item: CartItem, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    
    if (!isNaN(value) && value > 0) {
      this.cartService.updateQuantity(item.product.id, value);
    } else {
      this.cartService.updateQuantity(item.product.id, 1);
      target.value = '1';
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id);
  }

  updateCart(): void {
    // In a real app with a backend, we would sync the cart with the server here
    console.log('Cart updated:', this.cartItems);
    alert('Cart updated successfully!');
  }

  applyCoupon(): void {
    if (this.couponCode.toLowerCase() === 'discount10') {
      this.discount = this.calculateTotal() * 0.1;
      alert('Coupon applied successfully!');
    } else if (this.couponCode.toLowerCase() === 'discount20') {
      this.discount = this.calculateTotal() * 0.2;
      alert('Coupon applied successfully!');
    } else {
      this.discount = 0;
      alert('Invalid coupon code!');
    }
  }

  updateShipping(): void {
    // This is automatically handled by the two-way binding with [(ngModel)]
    console.log('Selected shipping:', this.selectedShipping);
  }
}
