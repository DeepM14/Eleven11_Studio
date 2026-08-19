import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Sparkle {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  sparkles: Sparkle[] = [];
  mapUrl: SafeResourceUrl;

  form = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };

  constructor(private sanitizer: DomSanitizer) {
    // Replace this URL with your own "Embed a map" src from Google Maps
    const rawUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d80.2707!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA0JzU3LjciTiA4MMKwMTYnMTQuNSJF!5e0!3m2!1sen!2sin!4v1234567890';
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  ngOnInit() {
    this.sparkles = Array.from({ length: 35 }, () => ({
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      size: (Math.random() * 2.5 + 1).toFixed(1) + 'px',
      delay: (Math.random() * 5).toFixed(1) + 's',
      duration: (Math.random() * 2.5 + 2).toFixed(1) + 's'
    }));
  }

  onSubmit() {
    const msg = `Hi Eleven 11! 👋%0A%0A*Name:* ${this.form.name}%0A*Phone:* ${this.form.phone}%0A*Email:* ${this.form.email || 'N/A'}%0A*Message:* ${this.form.message}`;
    const whatsappUrl = `https://wa.me/91XXXXXXXXXX?text=${msg}`;
    window.open(whatsappUrl, '_blank');
  }
}