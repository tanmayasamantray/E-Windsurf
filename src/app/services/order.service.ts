import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Order, OrderStatus } from '../models/order.model';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor(private cartService: CartService) {
    // Load orders from localStorage if available
    this.loadOrders();
  }

  /**
   * Load orders from localStorage
   */
  private loadOrders(): void {
    const savedOrders = localStorage.getItem('furniro_orders');
    if (savedOrders) {
      try {
        this.orders = JSON.parse(savedOrders);
        this.ordersSubject.next(this.orders);
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }
  }

  /**
   * Save orders to localStorage
   */
  private saveOrders(): void {
    localStorage.setItem('furniro_orders', JSON.stringify(this.orders));
  }

  /**
   * Create a new order
   * @param orderData Order data to create
   * @returns Observable with the created order
   */
  createOrder(orderData: Omit<Order, 'id' | 'orderDate' | 'status'>): Observable<Order> {
    // Generate a random order ID
    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Create the order with default values
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderDate: new Date(),
      status: 'pending'
    };

    // Add the order to the orders array
    this.orders.push(newOrder);
    this.ordersSubject.next(this.orders);
    this.saveOrders();

    // Clear the cart after successful order
    this.cartService.clearCart();

    // Simulate API delay
    return of(newOrder).pipe(delay(800));
  }

  /**
   * Get all orders
   * @returns Observable with all orders
   */
  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  /**
   * Get an order by ID
   * @param orderId Order ID
   * @returns Observable with the order or null if not found
   */
  getOrderById(orderId: string): Observable<Order | null> {
    return this.orders$.pipe(
      map(orders => orders.find(order => order.id === orderId) || null)
    );
  }

  /**
   * Update order status
   * @param orderId Order ID
   * @param status New order status
   * @returns Observable with the updated order or null if not found
   */
  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order | null> {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return of(null);
    }

    // Update the order status
    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      status
    };

    // Update the subject and save to localStorage
    this.ordersSubject.next(this.orders);
    this.saveOrders();

    // Simulate API delay
    return of(this.orders[orderIndex]).pipe(delay(500));
  }

  /**
   * Cancel an order
   * @param orderId Order ID
   * @returns Observable with the cancelled order or null if not found
   */
  cancelOrder(orderId: string): Observable<Order | null> {
    return this.updateOrderStatus(orderId, 'cancelled');
  }

  /**
   * Get orders by status
   * @param status Order status
   * @returns Observable with orders matching the status
   */
  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.orders$.pipe(
      map(orders => orders.filter(order => order.status === status))
    );
  }

  /**
   * Get recent orders
   * @param limit Maximum number of orders to return
   * @returns Observable with the most recent orders
   */
  getRecentOrders(limit: number = 5): Observable<Order[]> {
    return this.orders$.pipe(
      map(orders => 
        [...orders]
          .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
          .slice(0, limit)
      )
    );
  }
}
