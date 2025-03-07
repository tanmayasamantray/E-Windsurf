import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../../models/cart-item.model';
import { CustomerInfo, Order } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  total: number = 0;
  shippingCost: number = 0;
  orderPlaced: boolean = false;
  orderId: string = '';
  orderDate: Date | null = null;
  isProcessing: boolean = false;
  paymentMethods = [
    { id: 'credit-card', name: 'Credit Card' },
    { id: 'paypal', name: 'PayPal' },
    { id: 'bank-transfer', name: 'Bank Transfer' }
  ];
  shippingMethods = [
    { id: 'standard', name: 'Standard Delivery', cost: 0, time: '3-5 business days' },
    { id: 'express', name: 'Express Delivery', cost: 1500, time: '1-2 business days' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      // Billing details
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      companyName: [''],
      country: ['', [Validators.required]],
      streetAddress: ['', [Validators.required]],
      apartment: [''],
      townCity: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      
      // Order notes
      orderNotes: [''],
      
      // Payment method
      paymentMethod: ['credit-card', [Validators.required]],
      
      // Shipping method
      shippingMethod: ['standard', [Validators.required]],
      
      // Terms and conditions
      termsAccepted: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateTotals();
    
    // Update shipping cost when shipping method changes
    this.checkoutForm.get('shippingMethod')?.valueChanges.subscribe(method => {
      this.updateShippingCost(method);
      this.calculateTotals();
    });
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartService.calculateSubtotal();
    this.shippingCost = this.getShippingCost();
    this.total = this.subtotal + this.shippingCost;
  }

  getShippingCost(): number {
    const method = this.checkoutForm.get('shippingMethod')?.value;
    const selectedMethod = this.shippingMethods.find(m => m.id === method);
    return selectedMethod ? selectedMethod.cost : 0;
  }

  updateShippingCost(methodId: string): void {
    const selectedMethod = this.shippingMethods.find(m => m.id === methodId);
    this.shippingCost = selectedMethod ? selectedMethod.cost : 0;
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.checkoutForm.controls).forEach(key => {
        const control = this.checkoutForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // Process the order
    this.processOrder();
  }

  processOrder(): void {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    // Extract customer info from form
    const customerInfo: CustomerInfo = {
      firstName: this.checkoutForm.get('firstName')?.value,
      lastName: this.checkoutForm.get('lastName')?.value,
      companyName: this.checkoutForm.get('companyName')?.value,
      country: this.checkoutForm.get('country')?.value,
      streetAddress: this.checkoutForm.get('streetAddress')?.value,
      apartment: this.checkoutForm.get('apartment')?.value,
      townCity: this.checkoutForm.get('townCity')?.value,
      state: this.checkoutForm.get('state')?.value,
      zipCode: this.checkoutForm.get('zipCode')?.value,
      phone: this.checkoutForm.get('phone')?.value,
      email: this.checkoutForm.get('email')?.value
    };
    
    // Create order data
    const orderData = {
      items: this.cartItems,
      subtotal: this.subtotal,
      shippingCost: this.shippingCost,
      total: this.total,
      customerInfo,
      paymentMethod: this.checkoutForm.get('paymentMethod')?.value,
      shippingMethod: this.checkoutForm.get('shippingMethod')?.value,
      orderNotes: this.checkoutForm.get('orderNotes')?.value
    };
    
    // Create the order using the OrderService
    this.orderService.createOrder(orderData).subscribe({
      next: (order: Order) => {
        this.orderId = order.id;
        this.orderDate = order.orderDate;
        this.orderPlaced = true;
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.isProcessing = false;
        // In a real app, you would show an error message to the user
      }
    });
  }

  getSelectedShippingMethod(): any {
    const methodId = this.checkoutForm.get('shippingMethod')?.value;
    return this.shippingMethods.find(m => m.id === methodId);
  }

  getSelectedPaymentMethod(): any {
    const methodId = this.checkoutForm.get('paymentMethod')?.value;
    return this.paymentMethods.find(m => m.id === methodId);
  }

  // Helper method to check if a form control is invalid and touched
  isInvalid(controlName: string): boolean {
    const control = this.checkoutForm.get(controlName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }
}
