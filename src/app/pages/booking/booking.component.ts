import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Sparkle {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

interface ServiceCategory {
  name: string;
  services: string[];
}

@Component({
  selector: 'app-booking',
  standalone: false,
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  sparkles: Sparkle[] = [];
  submitted = false;
  lastWhatsappUrl = '';
  minDate = '';
  mapUrl: SafeResourceUrl;

  // >>> REPLACE WITH YOUR REAL SALON WHATSAPP NUMBER (country code, no + or spaces) <
  private readonly SALON_WHATSAPP_NUMBER = '91XXXXXXXXXX';

  booking = {
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  };

  serviceCategories: ServiceCategory[] = [
    { name: 'Hair Studio', services: ['Haircut & Styling', 'Hair Coloring & Highlights', 'Keratin & Smoothening'] },
    { name: 'Makeup Artistry', services: ['Party & Occasion Makeup', 'HD Makeup', 'Airbrush Makeup'] },
    { name: 'Spa & Wellness', services: ['Spa & Body Therapy', 'Manicure/Pedicure & Nail Art', 'Facials & Skincare'] },
    { name: 'Bridal', services: ['Classic Bridal Package', 'Premium Bridal Package', 'Royal Bridal Package'] }
  ];

  timeSlots: string[] = [
    '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  constructor(private sanitizer: DomSanitizer) {
    // Replace with your own "Embed a map" src from Google Maps (Share -> Embed a map)
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

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  onBook() {
    const formattedDate = this.formatDate(this.booking.date);

    const message =
      `Hi Eleven 11! 💇‍♀️ I'd like to book an appointment.%0A%0A` +
      `*Name:* ${this.booking.name}%0A` +
      `*Phone:* ${this.booking.phone}%0A` +
      `*Service:* ${this.booking.service}%0A` +
      `*Preferred Date:* ${formattedDate}%0A` +
      `*Preferred Time:* ${this.booking.time}%0A` +
      `*Notes:* ${this.booking.notes || 'None'}%0A%0A` +
      `Please confirm my slot. Thank you!`;

    this.lastWhatsappUrl = `https://wa.me/${this.SALON_WHATSAPP_NUMBER}?text=${message}`;

    window.open(this.lastWhatsappUrl, '_blank');

    this.submitted = true;
  }

  resetForm() {
    this.booking = { name: '', phone: '', service: '', date: '', time: '', notes: '' };
    this.submitted = false;
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}