import { Component, OnInit, HostListener } from '@angular/core';
import { FirebaseService } from '../../core/firebase.service';

interface Sparkle {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

interface GalleryItem {
  id?: string;
  img: string;
  caption: string;
  category: string;
}

@Component({
  selector: 'app-gallery',
  standalone: false,
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  sparkles: Sparkle[] = [];
  loading = true;

  categories = ['All', 'Hair', 'Makeup', 'Bridal', 'Spa'];
  activeFilter = 'All';

  allItems: GalleryItem[] = [];

  lightboxOpen = false;
  currentIndex = 0;

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    this.sparkles = Array.from({ length: 35 }, () => ({
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      size: (Math.random() * 2.5 + 1).toFixed(1) + 'px',
      delay: (Math.random() * 5).toFixed(1) + 's',
      duration: (Math.random() * 2.5 + 2).toFixed(1) + 's'
    }));

    await this.loadItems();
  }

  async loadItems() {
    this.loading = true;
    this.allItems = await this.firebaseService.getAll('gallery') as GalleryItem[];
    this.loading = false;
  }

  get filteredItems(): GalleryItem[] {
    if (this.activeFilter === 'All') return this.allItems;
    return this.allItems.filter(item => (item.category || '').trim().toLowerCase() === this.activeFilter.toLowerCase());
  }

  setFilter(cat: string) {
    this.activeFilter = cat;
  }

  openLightbox(index: number) {
    this.currentIndex = index;
    this.lightboxOpen = true;
  }

  closeLightbox() {
    this.lightboxOpen = false;
  }

  nextImage(event: Event) {
    event.stopPropagation();
    this.currentIndex = (this.currentIndex + 1) % this.filteredItems.length;
  }

  prevImage(event: Event) {
    event.stopPropagation();
    this.currentIndex = (this.currentIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (!this.lightboxOpen) return;
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowRight') this.currentIndex = (this.currentIndex + 1) % this.filteredItems.length;
    if (event.key === 'ArrowLeft') this.currentIndex = (this.currentIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
  }
}