import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../core/firebase.service';

interface Sparkle {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

interface ServiceItem {
  id?: string;
  category: string;
  name: string;
  desc: string;
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
  loading = true;

  categoryNames = ['Hair Studio', 'Makeup Artistry', 'Spa & Wellness'];
  categories: ServiceCategory[] = [];

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    this.sparkles = Array.from({ length: 35 }, () => ({
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      size: (Math.random() * 2.5 + 1).toFixed(1) + 'px',
      delay: (Math.random() * 5).toFixed(1) + 's',
      duration: (Math.random() * 2.5 + 2).toFixed(1) + 's'
    }));

    await this.loadServices();
  }

    async loadServices() {
    this.loading = true;
    const allServices = await this.firebaseService.getAll('services') as ServiceItem[];

    this.categories = this.categoryNames.map(catName => ({
      name: catName,
      services: allServices.filter(s => (s.category || '').trim().toLowerCase() === catName.toLowerCase())
    }));

    this.loading = false;
  }

  setActive(i: number) {
    this.activeIndex = i;
  }
}