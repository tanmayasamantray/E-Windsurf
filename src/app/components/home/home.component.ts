import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  category: string;
  featured: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  ngOnInit(): void {
    // In a real application, this would come from a service
    this.featuredProducts = [
      {
        id: 1,
        name: 'Syltherine',
        description: 'Stylish cafe chair',
        price: 2500.00,
        oldPrice: 3500.00,
        imageUrl: 'assets/images/product-1.png',
        category: 'Chair',
        featured: true
      },
      {
        id: 2,
        name: 'Leviosa',
        description: 'Stylish cafe chair',
        price: 2500.00,
        imageUrl: 'assets/images/product-2.png',
        category: 'Chair',
        featured: true
      },
      {
        id: 3,
        name: 'Lolito',
        description: 'Luxury big sofa',
        price: 7000.00,
        oldPrice: 14000.00,
        imageUrl: 'assets/images/product-3.png',
        category: 'Sofa',
        featured: true
      },
      {
        id: 4,
        name: 'Respira',
        description: 'Outdoor bar table and stool',
        price: 500.00,
        imageUrl: 'assets/images/product-4.png',
        category: 'Table',
        featured: true
      },
      {
        id: 5,
        name: 'Grifo',
        description: 'Night lamp',
        price: 1500.00,
        imageUrl: 'assets/images/product-5.png',
        category: 'Lamp',
        featured: true
      },
      {
        id: 6,
        name: 'Muggo',
        description: 'Small mug',
        price: 150.00,
        imageUrl: 'assets/images/product-6.png',
        category: 'Decor',
        featured: true
      },
      {
        id: 7,
        name: 'Pingky',
        description: 'Cute bed set',
        price: 7000.00,
        oldPrice: 14000.00,
        imageUrl: 'assets/images/product-7.png',
        category: 'Bed',
        featured: true
      },
      {
        id: 8,
        name: 'Potty',
        description: 'Minimalist flower pot',
        price: 500.00,
        imageUrl: 'assets/images/product-8.png',
        category: 'Decor',
        featured: true
      }
    ];
  }
}
