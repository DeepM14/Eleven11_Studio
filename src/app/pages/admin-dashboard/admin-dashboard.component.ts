import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../core/firebase.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'gallery' | 'homeGallery' | 'services' | 'bridal' | 'offers' = 'gallery';
  showSeedButton = false;
  seeding = false;

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  async ngOnInit() {
    const existing = await this.firebaseService.getAll('services');
    this.showSeedButton = existing.length === 0;
  }

  async seedData() {
    this.seeding = true;

    const services = [
      { category: 'Hair Studio', name: 'Haircut & Styling', desc: 'Precision cuts tailored to your face shape and lifestyle.', img: 'images/svc-haircut.jpeg' },
      { category: 'Hair Studio', name: 'Hair Coloring & Highlights', desc: 'Global color, balayage, and highlights using premium products.', img: 'images/svc-color.jpeg' },
      { category: 'Hair Studio', name: 'Keratin & Smoothening', desc: 'Long-lasting frizz control and shine treatments.', img: 'images/svc-keratin.jpeg' },
      { category: 'Makeup Artistry', name: 'Party & Occasion Makeup', desc: 'Glam makeup for parties, functions, and events.', img: 'images/svc-makeup-party.jpeg' },
      { category: 'Makeup Artistry', name: 'HD Makeup', desc: 'Camera-ready, high-definition finish that lasts all day.', img: 'images/svc-makeup-hd.jpeg' },
      { category: 'Makeup Artistry', name: 'Airbrush Makeup', desc: 'Featherlight, flawless airbrush finish for photography.', img: 'images/svc-makeup-airbrush.jpeg' },
      { category: 'Spa & Wellness', name: 'Spa & Body Therapy', desc: 'Relaxing therapies to refresh your skin and mind.', img: 'images/svc-spa.jpeg' },
      { category: 'Spa & Wellness', name: 'Manicure, Pedicure & Nail Art', desc: 'From classic to intricate nail art designs.', img: 'images/svc-nails.jpeg' },
      { category: 'Spa & Wellness', name: 'Facials & Skincare', desc: 'Deep-cleansing, brightening, and anti-aging facials.', img: 'images/svc-skincare.jpeg' }
    ];

    const gallery = [
      { img: 'images/gal-1.jpeg', caption: 'Balayage Highlights', category: 'Hair' },
      { img: 'images/gal-2.jpeg', caption: 'Keratin Smoothening', category: 'Hair' },
      { img: 'images/gal-3.jpeg', caption: 'Bridal Updo', category: 'Bridal' },
      { img: 'images/gal-4.jpeg', caption: 'HD Party Makeup', category: 'Makeup' },
      { img: 'images/gal-5.jpeg', caption: 'Airbrush Finish', category: 'Makeup' },
      { img: 'images/gal-6.jpeg', caption: 'Royal Bridal Look', category: 'Bridal' },
      { img: 'images/gal-7.jpeg', caption: 'Facial & Glow', category: 'Spa' },
      { img: 'images/gal-8.jpeg', caption: 'Nail Art Detail', category: 'Spa' }
    ];

    const offers = [
      { title: 'New Client Special', description: 'First-time clients get a flat discount on any hair service.', discount: '20% OFF', code: 'WELCOME20', validUntil: '31 Dec 2026' },
      { title: 'Bridal Package Offer', description: 'Book any Bridal Package and get a complimentary trial session.', discount: 'FREE TRIAL', code: 'BRIDALFREE', validUntil: '31 Dec 2026' },
      { title: 'Weekday Glow Offer', description: 'Get a discount on Makeup & Spa services, Monday to Thursday.', discount: '15% OFF', code: 'GLOW15', validUntil: '31 Dec 2026' }
    ];

    for (const s of services) await this.firebaseService.addItem('services', s);
    for (const g of gallery) await this.firebaseService.addItem('gallery', g);
    for (const o of offers) await this.firebaseService.addItem('offers', o);

    this.seeding = false;
    this.showSeedButton = false;
    window.location.reload();
  }

  async onLogout() {
    await this.firebaseService.logout();
    this.router.navigate(['/admin-login']);
  }
}