import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../core/firebase.service';

interface Sparkle {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

interface Faq {
  q: string;
  a: string;
}

interface BridalPackage {
  id?: string;
  position: number;
  name: string;
  tag: string;
  includes: string[];
  img: string;
  featured: boolean;
}

interface LookbookImage {
  id?: string;
  position: number;
  caption: string;
  img: string;
}

@Component({
  selector: 'app-bridal',
  standalone: false,
  templateUrl: './bridal.component.html',
  styleUrls: ['./bridal.component.css']
})
export class BridalComponent implements OnInit, OnDestroy {
  sparkles: Sparkle[] = [];
  openFaq: number | null = 0;

  packages: BridalPackage[] = [];
  lookbookImages: LookbookImage[] = [];

  activeSlide = 0;
  private autoplayTimer: any;

  faqs: Faq[] = [
    { q: 'How far in advance should I book my bridal consultation?', a: 'We recommend booking 2-3 months before your wedding date, especially for weekend dates which fill up quickly.' },
    { q: 'Do you travel to the wedding venue?', a: 'Yes, our Royal and Premium packages include on-location service. Travel charges may apply based on distance.' },
    { q: 'How many trial sessions do I get?', a: 'Classic includes 1 trial, Premium and Royal include 2 trials, so we can perfect your look before the big day.' },
    { q: 'Can I customize a package?', a: 'Absolutely — every bride is different. Book a consultation and we\'ll tailor a package around your specific needs.' },
    { q: 'How is pricing decided?', a: 'Pricing depends on your outfit style, number of looks, venue location, and add-ons like hair extensions or jewelry styling. We share a clear quote after your consultation.' }
  ];

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    this.sparkles = Array.from({ length: 40 }, () => ({
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      size: (Math.random() * 2.5 + 1).toFixed(1) + 'px',
      delay: (Math.random() * 5).toFixed(1) + 's',
      duration: (Math.random() * 2.5 + 2).toFixed(1) + 's'
    }));

    await this.loadPackages();
    await this.loadLookbook();
    this.startAutoplay();
  }

  ngOnDestroy() {
    clearInterval(this.autoplayTimer);
  }

  async loadPackages() {
    try {
      const raw = await this.firebaseService.getAll('bridalPackages') as BridalPackage[];
      this.packages = raw.sort((a, b) => a.position - b.position);
    } catch (err) {
      console.error('Failed to load bridal packages:', err);
      this.packages = [];
    }
  }

  async loadLookbook() {
    try {
      const raw = await this.firebaseService.getAll('bridalLookbook') as LookbookImage[];
      this.lookbookImages = raw.sort((a, b) => a.position - b.position);
    } catch (err) {
      console.error('Failed to load bridal lookbook:', err);
      this.lookbookImages = [];
    }
  }

  toggleFaq(i: number) {
    this.openFaq = this.openFaq === i ? null : i;
  }

  startAutoplay() {
    clearInterval(this.autoplayTimer);
    if (this.lookbookImages.length === 0) return;
    this.autoplayTimer = setInterval(() => this.nextSlide(), 3000);
  }

  pauseAutoplay() {
    clearInterval(this.autoplayTimer);
  }

  resumeAutoplay() {
    this.startAutoplay();
  }

  nextSlide() {
    if (this.lookbookImages.length === 0) return;
    this.activeSlide = (this.activeSlide + 1) % this.lookbookImages.length;
  }

  prevSlide() {
    if (this.lookbookImages.length === 0) return;
    this.activeSlide = (this.activeSlide - 1 + this.lookbookImages.length) % this.lookbookImages.length;
  }

  goToSlide(i: number) {
    this.activeSlide = i;
  }

  private getOffset(i: number): number {
    const total = this.lookbookImages.length;
    if (total === 0) return 0;
    let offset = i - this.activeSlide;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
  }

  getSlideTransform(i: number): string {
    const offset = this.getOffset(i);
    const absOffset = Math.abs(offset);
    if (absOffset > 2) {
      return `translateX(${offset > 0 ? 500 : -500}px) scale(0.4) rotateY(0deg)`;
    }
    const translateX = offset * 190;
    const rotateY = offset * -35;
    const scale = 1 - absOffset * 0.2;
    return `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
  }

  getSlideZ(i: number): number {
    return 10 - Math.abs(this.getOffset(i));
  }

  getSlideOpacity(i: number): number {
    return Math.abs(this.getOffset(i)) > 2 ? 0 : 1;
  }
}