import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../core/firebase.service';

interface Sparkle {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

interface Offer {
  id?: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  validUntil: string;
}

@Component({
  selector: 'app-offers',
  standalone: false,
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  sparkles: Sparkle[] = [];
  copiedCode: string | null = null;
  loading = true;

  offers: Offer[] = [];

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    this.sparkles = Array.from({ length: 16 }, () => ({
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      size: (Math.random() * 2.5 + 1).toFixed(1) + 'px',
      delay: (Math.random() * 5).toFixed(1) + 's',
      duration: (Math.random() * 2.5 + 2).toFixed(1) + 's'
    }));

    await this.loadOffers();
  }

  async loadOffers() {
    this.loading = true;
    this.offers = await this.firebaseService.getAll('offers') as Offer[];
    this.loading = false;
  }

  copyCode(code: string, event: Event) {
    event.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      this.copiedCode = code;
      setTimeout(() => {
        if (this.copiedCode === code) this.copiedCode = null;
      }, 2000);
    });
  }
}