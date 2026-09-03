import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../core/firebase.service';
import { cloudinaryConfig } from '../../../firebase-config';

interface ServiceItem {
  id?: string;
  category: string;
  name: string;
  desc: string;
  img: string;
}

@Component({
  selector: 'app-admin-services',
  standalone: false,
  templateUrl: './admin-services.component.html',
  styleUrls: ['./admin-services.component.css']
})
export class AdminServicesComponent implements OnInit {
  items: ServiceItem[] = [];
  loading = true;
  uploading = false;
  errorMsg = '';
  editingId: string | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  newItem: ServiceItem = {
    category: 'Hair Studio',
    name: '',
    desc: '',
    img: ''
  };

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadItems();
  }

  async loadItems() {
    this.loading = true;
    this.items = await this.firebaseService.getAll('services') as ServiceItem[];
    this.loading = false;
  }
    categoryNames = ['Hair Studio', 'Makeup Artistry', 'Spa & Wellness'];

  getByCategory(cat: string): ServiceItem[] {
    return this.items.filter(i => (i.category || '').trim().toLowerCase() === cat.toLowerCase());
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  async saveItem() {
    if (!this.newItem.name || !this.newItem.desc) {
      this.errorMsg = 'Please fill in the name and description.';
      return;
    }
    if (!this.editingId && !this.selectedFile) {
      this.errorMsg = 'Please choose a photo.';
      return;
    }
    this.errorMsg = '';
    this.uploading = true;

    try {
      let imgUrl = this.newItem.img;
      if (this.selectedFile) {
        imgUrl = await this.uploadToCloudinary(this.selectedFile);
      }

      const payload = { ...this.newItem, img: imgUrl };

      if (this.editingId) {
        await this.firebaseService.updateItem('services', this.editingId, payload);
      } else {
        await this.firebaseService.addItem('services', payload);
      }

      this.resetForm();
      await this.loadItems();
    } catch (err) {
      this.errorMsg = 'Something went wrong. Please try again.';
    } finally {
      this.uploading = false;
    }
  }

  editItem(item: ServiceItem) {
    this.editingId = item.id || null;
    this.newItem = { category: item.category, name: item.name, desc: item.desc, img: item.img };
    this.selectedFile = null;
    this.previewUrl = null;
  }

  cancelEdit() {
    this.resetForm();
  }

  async deleteItem(id: string | undefined) {
    if (!id) return;
    if (!confirm('Delete this service?')) return;
    await this.firebaseService.deleteItem('services', id);
    await this.loadItems();
  }

  private resetForm() {
    this.editingId = null;
    this.newItem = { category: 'Hair Studio', name: '', desc: '', img: '' };
    this.selectedFile = null;
    this.previewUrl = null;
  }

  private async uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) throw new Error('Cloudinary upload failed');
    const data = await response.json();
    return data.secure_url;
  }
}