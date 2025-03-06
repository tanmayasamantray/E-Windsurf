import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Mock data for products - in a real application, this would come from an API
  private products: Product[] = [
    {
      id: 1,
      name: 'Syltherine',
      description: 'Stylish cafe chair with wooden legs and comfortable upholstery. Perfect for dining rooms and cafes.',
      price: 2500,
      imageUrl: 'assets/images/products/product-1.png',
      category: 'Chair',
      discount: 30,
      isNew: false
    },
    {
      id: 2,
      name: 'Leviosa',
      description: 'Modern floating shelf design that appears to levitate against the wall. Great for minimalist interiors.',
      price: 2500,
      imageUrl: 'assets/images/products/product-2.png',
      category: 'Shelf',
      discount: 0,
      isNew: true
    },
    {
      id: 3,
      name: 'Lolito',
      description: 'Contemporary nightstand with clean lines and ample storage. Features soft-close drawers.',
      price: 7000,
      imageUrl: 'assets/images/products/product-3.png',
      category: 'Nightstand',
      discount: 50,
      isNew: false
    },
    {
      id: 4,
      name: 'Respira',
      description: 'Ergonomic office chair designed for maximum comfort during long work sessions. Adjustable height and lumbar support.',
      price: 5000,
      imageUrl: 'assets/images/products/product-4.png',
      category: 'Chair',
      discount: 0,
      isNew: true
    },
    {
      id: 5,
      name: 'Grifo',
      description: 'Elegant dining table with solid wood construction. Seats up to six people comfortably.',
      price: 2500,
      imageUrl: 'assets/images/products/product-5.png',
      category: 'Table',
      discount: 0,
      isNew: false
    },
    {
      id: 6,
      name: 'Muggo',
      description: 'Set of four modern coffee mugs in assorted colors. Microwave and dishwasher safe.',
      price: 1500,
      imageUrl: 'assets/images/products/product-6.png',
      category: 'Mug',
      discount: 40,
      isNew: false
    },
    {
      id: 7,
      name: 'Pingky',
      description: 'Plush children\'s bed with safety rails and non-toxic finishes. Suitable for ages 3-10.',
      price: 7000,
      imageUrl: 'assets/images/products/product-7.png',
      category: 'Bed',
      discount: 0,
      isNew: true
    },
    {
      id: 8,
      name: 'Potty',
      description: 'Decorative ceramic flower pot with drainage system. Available in multiple sizes.',
      price: 5000,
      imageUrl: 'assets/images/products/product-8.png',
      category: 'Flower Pot',
      discount: 0,
      isNew: false
    }
  ];

  // Product gallery images - in a real app, these would be fetched from an API
  private productGalleries: { [key: number]: string[] } = {
    1: [
      'assets/images/products/product-1.png',
      'assets/images/products/product-1-1.png',
      'assets/images/products/product-1-2.png',
      'assets/images/products/product-1-3.png'
    ],
    2: [
      'assets/images/products/product-2.png',
      'assets/images/products/product-2-1.png',
      'assets/images/products/product-2-2.png'
    ],
    3: [
      'assets/images/products/product-3.png',
      'assets/images/products/product-3-1.png',
      'assets/images/products/product-3-2.png',
      'assets/images/products/product-3-3.png'
    ],
    4: [
      'assets/images/products/product-4.png',
      'assets/images/products/product-4-1.png',
      'assets/images/products/product-4-2.png'
    ],
    5: [
      'assets/images/products/product-5.png',
      'assets/images/products/product-5-1.png',
      'assets/images/products/product-5-2.png'
    ],
    6: [
      'assets/images/products/product-6.png',
      'assets/images/products/product-6-1.png',
      'assets/images/products/product-6-2.png'
    ],
    7: [
      'assets/images/products/product-7.png',
      'assets/images/products/product-7-1.png',
      'assets/images/products/product-7-2.png'
    ],
    8: [
      'assets/images/products/product-8.png',
      'assets/images/products/product-8-1.png',
      'assets/images/products/product-8-2.png'
    ]
  };

  // BehaviorSubject to track the currently selected product
  private selectedProductSubject = new BehaviorSubject<Product | null>(null);
  selectedProduct$ = this.selectedProductSubject.asObservable();

  constructor() { }

  /**
   * Get all products
   * @returns Observable of all products
   */
  getProducts(): Observable<Product[]> {
    // Simulate API delay
    return of(this.products).pipe(delay(500));
  }

  /**
   * Get a product by ID
   * @param id Product ID
   * @returns Observable of the product or null if not found
   */
  getProductById(id: number): Observable<Product | null> {
    // Simulate API delay
    return of(this.products.find(product => product.id === id) || null).pipe(
      delay(500),
      map(product => {
        if (product) {
          this.selectedProductSubject.next(product);
        }
        return product;
      })
    );
  }

  /**
   * Get product gallery images
   * @param productId Product ID
   * @returns Array of image URLs or empty array if not found
   */
  getProductGallery(productId: number): string[] {
    return this.productGalleries[productId] || [];
  }

  /**
   * Get related products based on category
   * @param productId Current product ID to exclude from results
   * @param limit Maximum number of related products to return
   * @returns Observable of related products
   */
  getRelatedProducts(productId: number, limit: number = 4): Observable<Product[]> {
    const currentProduct = this.products.find(p => p.id === productId);
    
    if (!currentProduct) {
      return of([]);
    }

    // Find products in the same category, excluding the current product
    const relatedProducts = this.products
      .filter(p => p.category === currentProduct.category && p.id !== productId)
      .slice(0, limit);
    
    // If we don't have enough related products in the same category, add some from other categories
    if (relatedProducts.length < limit) {
      const remainingCount = limit - relatedProducts.length;
      const otherProducts = this.products
        .filter(p => p.category !== currentProduct.category && p.id !== productId)
        .slice(0, remainingCount);
      
      relatedProducts.push(...otherProducts);
    }

    // Simulate API delay
    return of(relatedProducts).pipe(delay(300));
  }

  /**
   * Get featured products
   * @param limit Maximum number of featured products to return
   * @returns Observable of featured products
   */
  getFeaturedProducts(limit: number = 8): Observable<Product[]> {
    // For this demo, we'll just return products with a discount
    const featuredProducts = this.products
      .filter(p => p.discount && p.discount > 0)
      .slice(0, limit);
    
    // If we don't have enough discounted products, add some new products
    if (featuredProducts.length < limit) {
      const remainingCount = limit - featuredProducts.length;
      const newProducts = this.products
        .filter(p => p.isNew && (!p.discount || p.discount === 0))
        .slice(0, remainingCount);
      
      featuredProducts.push(...newProducts);
    }

    // If we still don't have enough, add other products
    if (featuredProducts.length < limit) {
      const remainingCount = limit - featuredProducts.length;
      const otherProducts = this.products
        .filter(p => !featuredProducts.includes(p))
        .slice(0, remainingCount);
      
      featuredProducts.push(...otherProducts);
    }

    // Simulate API delay
    return of(featuredProducts).pipe(delay(300));
  }

  /**
   * Get new products
   * @param limit Maximum number of new products to return
   * @returns Observable of new products
   */
  getNewProducts(limit: number = 4): Observable<Product[]> {
    // Return products marked as new
    const newProducts = this.products
      .filter(p => p.isNew)
      .slice(0, limit);
    
    // Simulate API delay
    return of(newProducts).pipe(delay(300));
  }

  /**
   * Search products by name or description
   * @param query Search query
   * @returns Observable of matching products
   */
  searchProducts(query: string): Observable<Product[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    const normalizedQuery = query.toLowerCase().trim();
    
    const results = this.products.filter(product => 
      product.name.toLowerCase().includes(normalizedQuery) || 
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery)
    );

    // Simulate API delay
    return of(results).pipe(delay(300));
  }

  /**
   * Get products by category
   * @param category Category name
   * @param limit Maximum number of products to return
   * @returns Observable of products in the specified category
   */
  getProductsByCategory(category: string, limit?: number): Observable<Product[]> {
    let filteredProducts = this.products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );

    if (limit) {
      filteredProducts = filteredProducts.slice(0, limit);
    }

    // Simulate API delay
    return of(filteredProducts).pipe(delay(300));
  }

  /**
   * Get all available product categories
   * @returns Observable of unique category names
   */
  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.products.map(p => p.category))];
    return of(categories).pipe(delay(200));
  }
}
