import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../core/firebase.service';
import { cloudinaryConfig } from '../../../firebase-config';

interface HomeGalleryItem {
  id?: string;
  position: number;
  caption: string;
  img: string;
}

@Component({
  selector: 'app-admin-home-gallery',
  standalone: false,
  templateUrl: './admin-home-gallery.component.html',
  styleUrls: ['./admin-home-gallery.component.css']
})
export class AdminHomeGalleryComponent implements OnInit {
  items: HomeGalleryItem[] = [];
  uploading = false;
  errorMsg = '';

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  newItem = {
    position: 1,
    caption: ''
  };

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadItems();
  }

  async loadItems() {
    const raw = await this.firebaseService.getAll('homeGallery') as HomeGalleryItem[];
    this.items = raw.sort((a, b) => a.position - b.position);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  async savePhoto() {
    if (!this.selectedFile || !this.newItem.caption) {
      this.errorMsg = 'Please select a photo and enter a caption.';
      return;
    }
    this.errorMsg = '';
    this.uploading = true;

    try {
      const imageUrl = await this.uploadToCloudinary(this.selectedFile);

      // If a photo already exists at this position, replace it (delete old, add new)
      const existing = this.items.find(i => i.position === Number(this.newItem.position));
      if (existing && existing.id) {
        await this.firebaseService.deleteItem('homeGallery', existing.id);
      }

      await this.firebaseService.addItem('homeGallery', {
        position: Number(this.newItem.position),
        caption: this.newItem.caption,
        img: imageUrl
      });

      this.selectedFile = null;
      this.previewUrl = null;
      this.newItem = { position: 1, caption: '' };

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
    await this.firebaseService.deleteItem('homeGallery', id);
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