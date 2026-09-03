import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../core/firebase.service';

interface Sparkle {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

interface HomeGalleryItem {
  id?: string;
  position: number;
  caption: string;
  img: string;
}

interface FeaturedService {
  name: string;
  desc: string;
  img: string;
  category: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sparkles: Sparkle[] = [];
  homeGalleryItems: HomeGalleryItem[] = [];
  featuredServices: FeaturedService[] = [];

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    this.sparkles = Array.from({ length: 16 }, () => ({
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      size: (Math.random() * 2.5 + 1).toFixed(1) + 'px',
      delay: (Math.random() * 5).toFixed(1) + 's',
      duration: (Math.random() * 2.5 + 2).toFixed(1) + 's'
    }));

    await this.loadHomeGallery();
    await this.loadFeaturedServices();
  }

  async loadHomeGallery() {
    try {
      const raw = await this.firebaseService.getAll('homeGallery') as HomeGalleryItem[];
      this.homeGalleryItems = raw.sort((a, b) => a.position - b.position);
    } catch (err) {
      console.error('Failed to load home gallery:', err);
      this.homeGalleryItems = [];
    }
  }

  async loadFeaturedServices() {
    try {
      const allServices = await this.firebaseService.getAll('services') as any[];
      const categories = ['Hair Studio', 'Makeup Artistry', 'Spa & Wellness'];

      this.featuredServices = categories
        .map(cat => allServices.find(s => (s.category || '').trim().toLowerCase() === cat.toLowerCase()))
        .filter((s): s is FeaturedService => s !== undefined);
    } catch (err) {
      console.error('Failed to load featured services:', err);
      this.featuredServices = [];
    }
  }
}