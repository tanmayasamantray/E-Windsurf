import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategories: string[] = [];
  priceRange: number = 10000;
  showFilterPanel: boolean = false;
  sortOption: string = 'default';
  viewMode: string = 'grid';
  
  // Pagination
  itemsPerPage: number = 9;
  currentPage: number = 1;
  totalPages: number = 1;

  ngOnInit(): void {
    // In a real app, this would come from a service
    this.loadProducts();
    this.extractCategories();
    this.applyFilters();
  }

  loadProducts(): void {
    this.products = [
      {
        id: 1,
        name: 'Syltherine',
        description: 'Stylish cafe chair',
        price: 2500.00,
        imageUrl: 'assets/images/product-1.png',
        category: 'Chair',
        discount: 30,
        isNew: false
      },
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
        category: 'Table'
      },
      {
        id: 5,
        name: 'Grifo',
        description: 'Night lamp',
        price: 1500.00,
        imageUrl: 'assets/images/product-5.png',
        category: 'Lamp',
        isNew: true
      },
      {
        id: 6,
        name: 'Muggo',
        description: 'Small mug',
        price: 150.00,
        imageUrl: 'assets/images/product-6.png',
        category: 'Decor'
      },
      {
        id: 7,
        name: 'Pingky',
        description: 'Cute bed set',
        price: 7000.00,
        imageUrl: 'assets/images/product-7.png',
        category: 'Bed',
        discount: 50
      },
      {
        id: 8,
        name: 'Potty',
        description: 'Minimalist flower pot',
        price: 500.00,
        imageUrl: 'assets/images/product-8.png',
        category: 'Decor'
      },
      {
        id: 9,
        name: 'Brekke',
        description: 'Modern dining table',
        price: 3500.00,
        imageUrl: 'assets/images/product-9.png',
        category: 'Table',
        isNew: true
      },
      {
        id: 10,
        name: 'Elvin',
        description: 'Comfortable armchair',
        price: 1800.00,
        imageUrl: 'assets/images/product-10.png',
        category: 'Chair',
        discount: 20
      },
      {
        id: 11,
        name: 'Lumina',
        description: 'Pendant light fixture',
        price: 950.00,
        imageUrl: 'assets/images/product-11.png',
        category: 'Lamp'
      },
      {
        id: 12,
        name: 'Cozy',
        description: 'Single sofa',
        price: 1200.00,
        imageUrl: 'assets/images/product-12.png',
        category: 'Sofa',
        isNew: true
      }
    ];
  }

  extractCategories(): void {
    // Extract unique categories
    const categorySet = new Set<string>();
    this.products.forEach(product => {
      categorySet.add(product.category);
    });
    this.categories = Array.from(categorySet);
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  filterByCategory(event: Event): void {
    const target = event.target as HTMLInputElement;
    const category = target.value;
    
    if (target.checked) {
      if (!this.selectedCategories.includes(category)) {
        this.selectedCategories.push(category);
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
  }

  filterByPrice(): void {
    // This will be used in applyFilters
  }

  applyFilters(): void {
    // Filter by category if any selected
    let filtered = this.products;
    
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(product => this.selectedCategories.includes(product.category));
    }
    
    // Filter by price range
    filtered = filtered.filter(product => this.calculateDiscountedPrice(product) <= this.priceRange);
    
    // Sort products
    this.sortFilteredProducts(filtered);
    
    // Update pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredProducts = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  sortProducts(): void {
    this.sortFilteredProducts(this.filteredProducts);
  }

  sortFilteredProducts(products: Product[]): void {
    switch (this.sortOption) {
      case 'price-low':
        products.sort((a, b) => this.calculateDiscountedPrice(a) - this.calculateDiscountedPrice(b));
        break;
      case 'price-high':
        products.sort((a, b) => this.calculateDiscountedPrice(b) - this.calculateDiscountedPrice(a));
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (by id)
        products.sort((a, b) => a.id - b.id);
    }
  }

  calculateDiscountedPrice(product: Product): number {
    if (product.discount) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  }

  setViewMode(mode: string): void {
    this.viewMode = mode;
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  addToCart(product: Product): void {
    // This would typically call a cart service
    console.log('Added to cart:', product);
    // TODO: Implement actual cart functionality
  }

  addToWishlist(product: Product): void {
    // This would typically call a wishlist service
    console.log('Added to wishlist:', product);
    // TODO: Implement actual wishlist functionality
  }
}
