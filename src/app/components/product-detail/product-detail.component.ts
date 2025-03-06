import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(parseInt(id, 10));
      } else {
        // Redirect to shop if no ID provided
        this.router.navigate(['/shop']);
      }
    });
  }

  loadProduct(id: number): void {
    // In a real app, this would come from a product service
    // Mock data for demonstration
    this.product = {
      id: id,
      name: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500.00,
      imageUrl: 'assets/images/product-1.png',
      category: 'Chair',
      discount: 30,
      isNew: false
    };

    this.loadRelatedProducts();
  }

  loadRelatedProducts(): void {
    // In a real app, this would come from a product service based on the current product
    // Mock data for demonstration
    this.relatedProducts = [
      {
        id: 2,
        name: 'Leviosa',
        description: 'Stylish cafe chair',
        price: 2500.00,
        imageUrl: 'assets/images/product-2.png',
        category: 'Chair',
        isNew: true
      },
      {
        id: 3,
        name: 'Lolito',
        description: 'Luxury big sofa',
        price: 7000.00,
        imageUrl: 'assets/images/product-3.png',
        category: 'Sofa',
        discount: 50
      },
      {
        id: 4,
        name: 'Respira',
        description: 'Outdoor bar table and stool',
        price: 500.00,
        imageUrl: 'assets/images/product-4.png',
        category: 'Table',
        isNew: true
      }
    ];
  }

  calculatePrice(): number {
    if (!this.product) return 0;
    
    if (this.product.discount) {
      return this.product.price * (1 - this.product.discount / 100);
    }
    return this.product.price;
  }

  calculateProductPrice(product: Product): number {
    if (product.discount) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  updateQuantity(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    
    if (!isNaN(value) && value > 0) {
      this.quantity = value;
    } else {
      this.quantity = 1;
      target.value = '1';
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      alert(`${this.quantity} ${this.product.name}(s) added to cart!`);
    }
  }

  addToCartQuick(product: Product): void {
    this.cartService.addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }
}
