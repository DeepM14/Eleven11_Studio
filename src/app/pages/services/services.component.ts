import { Component, OnInit } from '@angular/core';

interface Sparkle {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

interface ServiceItem {
  name: string;
  desc: string;
  price: string;
  img: string;
}

interface ServiceCategory {
  name: string;
  services: ServiceItem[];
}

@Component({
  selector: 'app-services',
  standalone: false,
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  sparkles: Sparkle[] = [];
  activeIndex = 0;

  categories: ServiceCategory[] = [
    {
      name: 'Hair Studio',
      services: [
        { name: 'Haircut & Styling', desc: 'Precision cuts tailored to your face shape and lifestyle.', price: '₹499', img: 'images/svc-haircut.jpg' },
        { name: 'Hair Coloring & Highlights', desc: 'Global color, balayage, and highlights using premium products.', price: '₹1,999', img: 'images/svc-color.jpeg' },
        { name: 'Keratin & Smoothening', desc: 'Long-lasting frizz control and shine treatments.', price: '₹3,499', img: 'images/svc-keratin.jpeg' }
      ]
    },
    {
      name: 'Makeup Artistry',
      services: [
        { name: 'Party & Occasion Makeup', desc: 'Glam makeup for parties, functions, and events.', price: '₹1,499', img: 'images/svc-makeup-party.jpeg' },
        { name: 'HD Makeup', desc: 'Camera-ready, high-definition finish that lasts all day.', price: '₹2,999', img: 'images/svc-makeup-hd.jpeg' },
        { name: 'Airbrush Makeup', desc: 'Featherlight, flawless airbrush finish for photography.', price: '₹3,999', img: 'images/svc-makeup-airbrush.jpeg' }
      ]
    },
    {
      name: 'Spa & Wellness',
      services: [
        { name: 'Spa & Body Therapy', desc: 'Relaxing therapies to refresh your skin and mind.', price: '₹1,299', img: 'images/svc-spa.jpeg' },
        { name: 'Manicure, Pedicure & Nail Art', desc: 'From classic to intricate nail art designs.', price: '₹699', img: 'images/svc-nails.jpeg' },
        { name: 'Facials & Skincare', desc: 'Deep-cleansing, brightening, and anti-aging facials.', price: '₹999', img: 'images/svc-skincare.jpeg' }
      ]
    }
  ];

  ngOnInit() {
    this.sparkles = Array.from({ length: 35 }, () => ({
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      size: (Math.random() * 2.5 + 1).toFixed(1) + 'px',
      delay: (Math.random() * 5).toFixed(1) + 's',
      duration: (Math.random() * 2.5 + 2).toFixed(1) + 's'
    }));
  }

  setActive(i: number) {
    this.activeIndex = i;
  }
}