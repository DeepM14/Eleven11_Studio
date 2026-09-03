import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../core/firebase.service';
import { cloudinaryConfig } from '../../../firebase-config';

interface GalleryItem {
  id?: string;
  img: string;
  caption: string;
  category: string;
}

@Component({
  selector: 'app-admin-gallery',
  standalone: false,
  templateUrl: './admin-gallery.component.html',
  styleUrls: ['./admin-gallery.component.css']
})
export class AdminGalleryComponent implements OnInit {
  items: GalleryItem[] = [];
  loading = true;
  uploading = false;
  errorMsg = '';

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  newItem = {
    caption: '',
    category: 'Hair'
  };

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadItems();
  }

  async loadItems() {
    this.loading = true;
    this.items = await this.firebaseService.getAll('gallery') as GalleryItem[];
    this.loading = false;
  }
    categoryNames = ['Hair', 'Makeup', 'Bridal', 'Spa'];

  getByCategory(cat: string): GalleryItem[] {
    return this.items.filter(i => (i.category || '').trim().toLowerCase() === cat.toLowerCase());
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  async addPhoto() {
    if (!this.selectedFile || !this.newItem.caption) {
      this.errorMsg = 'Please select a photo and enter a caption.';
      return;
    }

    this.errorMsg = '';
    this.uploading = true;

    try {
      const imageUrl = await this.uploadToCloudinary(this.selectedFile);

      await this.firebaseService.addItem('gallery', {
        img: imageUrl,
        caption: this.newItem.caption,
        category: this.newItem.category
      });

      this.selectedFile = null;
      this.previewUrl = null;
      this.newItem = { caption: '', category: 'Hair' };

      await this.loadItems();
    } catch (err) {
      this.errorMsg = 'Upload failed. Please try again.';
    } finally {
      this.uploading = false;
    }
  }

  async deletePhoto(id: string | undefined) {
    if (!id) return;
    if (!confirm('Delete this photo?')) return;
    await this.firebaseService.deleteItem('gallery', id);
    await this.loadItems();
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