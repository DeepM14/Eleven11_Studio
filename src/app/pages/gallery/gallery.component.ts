import { Component, OnInit, HostListener } from '@angular/core';

interface Sparkle {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

interface GalleryItem {
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

  categories = ['All', 'Hair', 'Makeup', 'Bridal', 'Spa'];
  activeFilter = 'All';

  allItems: GalleryItem[] = [
    { img: 'images/gal-1.jpeg', caption: 'Balayage Highlights', category: 'Hair' },
    { img: 'images/gal-2.jpeg', caption: 'Keratin Smoothening', category: 'Hair' },
    { img: 'images/gal-3.jpeg', caption: 'Bridal Updo', category: 'Bridal' },
    { img: 'images/gal-4.jpeg', caption: 'HD Party Makeup', category: 'Makeup' },
    { img: 'images/gal-5.jpeg', caption: 'Airbrush Finish', category: 'Makeup' },
    { img: 'images/gal-6.jpeg', caption: 'Royal Bridal Look', category: 'Bridal' },
    { img: 'images/gal-7.jpeg', caption: 'Facial & Glow', category: 'Spa' },
    { img: 'images/gal-9.jpeg', caption: 'Layered Haircut', category: 'Hair' },
    { img: 'images/gal-10.jpeg', caption: 'Bridal Trial Session', category: 'Bridal' },
    { img: 'images/gal-11.jpeg', caption: 'Evening Glam', category: 'Makeup' },
    { img: 'images/gal-12.jpeg', caption: 'Hair Spa', category: 'Spa' }
  ];

  lightboxOpen = false;
  currentIndex = 0;

  ngOnInit() {
    this.sparkles = Array.from({ length: 35 }, () => ({
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      size: (Math.random() * 2.5 + 1).toFixed(1) + 'px',
      delay: (Math.random() * 5).toFixed(1) + 's',
      duration: (Math.random() * 2.5 + 2).toFixed(1) + 's'
    }));
  }

  get filteredItems(): GalleryItem[] {
    if (this.activeFilter === 'All') return this.allItems;
    return this.allItems.filter(item => item.category === this.activeFilter);
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