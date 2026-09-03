import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../core/firebase.service';

interface Offer {
  id?: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  validUntil: string;
}

@Component({
  selector: 'app-admin-offers',
  standalone: false,
  templateUrl: './admin-offers.component.html',
  styleUrls: ['./admin-offers.component.css']
})
export class AdminOffersComponent implements OnInit {
  items: Offer[] = [];
  loading = true;
  errorMsg = '';
  editingId: string | null = null;

  newItem: Offer = {
    title: '',
    description: '',
    discount: '',
    code: '',
    validUntil: ''
  };

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadItems();
  }

  async loadItems() {
    this.loading = true;
    this.items = await this.firebaseService.getAll('offers') as Offer[];
    this.loading = false;
  }

    async saveItem() {
    if (!this.newItem.title || !this.newItem.discount) {
      this.errorMsg = 'Please fill in at least Title and Discount.';
      return;
    }
    this.errorMsg = '';

    // Promo code is optional — format it only if provided
    const payload = {
      ...this.newItem,
      code: this.newItem.code ? this.newItem.code.trim().toUpperCase().replace(/\s+/g, '') : ''
    };

    if (this.editingId) {
      await this.firebaseService.updateItem('offers', this.editingId, payload);
    } else {
      await this.firebaseService.addItem('offers', payload);
    }

    this.resetForm();
    await this.loadItems();
  }

  editItem(item: Offer) {
    this.editingId = item.id || null;
    this.newItem = {
      title: item.title,
      description: item.description,
      discount: item.discount,
      code: item.code,
      validUntil: item.validUntil
    };
  }

  cancelEdit() {
    this.resetForm();
  }

  async deleteItem(id: string | undefined) {
    if (!id) return;
    if (!confirm('Delete this offer?')) return;
    await this.firebaseService.deleteItem('offers', id);
    await this.loadItems();
  }

  private resetForm() {
    this.editingId = null;
    this.newItem = { title: '', description: '', discount: '', code: '', validUntil: '' };
  }
}