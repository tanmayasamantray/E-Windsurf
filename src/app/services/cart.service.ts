import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();
  
  // Mock data for demonstration
  private mockItems: CartItem[] = [
    {
      product: {
        id: 1,
        name: 'Syltherine',
        description: 'Stylish cafe chair',
        price: 2500.00,
        imageUrl: 'assets/images/product-1.png',
        category: 'Chair',
        discount: 30
      },
      quantity: 1
    },
    {
      product: {
        id: 3,
        name: 'Lolito',
        description: 'Luxury big sofa',
        price: 7000.00,
        imageUrl: 'assets/images/product-3.png',
        category: 'Sofa',
        discount: 50
      },
      quantity: 2
    }
  ];

  constructor() {
    // Initialize with mock data
    this.cartItemsSubject.next(this.mockItems);
    
    // In a real app, we would load from localStorage here
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('furniroCart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        this.cartItemsSubject.next(cartItems);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('furniroCart', JSON.stringify(this.cartItemsSubject.value));
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex !== -1) {
      // Update quantity if product already exists in cart
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      this.cartItemsSubject.next(updatedItems);
    } else {
      // Add new product to cart
      this.cartItemsSubject.next([...currentItems, { product, quantity }]);
    }

    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage();
  }

  getCartCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems$.subscribe(items => {
        const count = items.reduce((total, item) => total + item.quantity, 0);
        observer.next(count);
      });
    });
  }

  getCartTotal(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems$.subscribe(items => {
        const total = items.reduce((sum, item) => {
          const itemPrice = item.product.discount 
            ? item.product.price * (1 - item.product.discount / 100) 
            : item.product.price;
          return sum + (itemPrice * item.quantity);
        }, 0);
        observer.next(total);
      });
    });
  }

  calculateSubtotal(): number {
    const items = this.cartItemsSubject.value;
    return items.reduce((sum, item) => {
      const itemPrice = item.product.discount 
        ? item.product.price * (1 - item.product.discount / 100) 
        : item.product.price;
      return sum + (itemPrice * item.quantity);
    }, 0);
  }
}
