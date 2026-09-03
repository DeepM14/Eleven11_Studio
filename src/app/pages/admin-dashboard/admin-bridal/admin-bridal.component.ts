import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../core/firebase.service';
import { cloudinaryConfig } from '../../../firebase-config';

interface BridalPackage {
  id?: string;
  position: number;
  name: string;
  tag: string;
  includes: string[];
  img: string;
  featured: boolean;
}

interface LookbookPhoto {
  id?: string;
  position: number;
  caption: string;
  img: string;
}

@Component({
  selector: 'app-admin-bridal',
  standalone: false,
  templateUrl: './admin-bridal.component.html',
  styleUrls: ['./admin-bridal.component.css']
})
export class AdminBridalComponent implements OnInit {
  // ---- Packages ----
  packages: BridalPackage[] = [];
  editingPackageId: string | null = null;
  packageUploading = false;
  packageErrorMsg = '';
  packageSelectedFile: File | null = null;
  packagePreviewUrl: string | null = null;

  newPackage = {
    position: 1,
    name: '',
    tag: '',
    includesText: '',
    img: '',
    featured: false
  };

  // ---- Lookbook ----
  lookbook: LookbookPhoto[] = [];
  lookUploading = false;
  lookErrorMsg = '';
  lookSelectedFile: File | null = null;
  lookPreviewUrl: string | null = null;

  newLook = {
  caption: '',
  img: ''
};

editingLookId: string | null = null;

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadPackages();
    await this.loadLookbook();
  }

  // ===== SEED / IMPORT EXISTING CONTENT =====

  async seedBridalContent() {
    this.packageUploading = true;

    const packages = [
      {
        position: 1,
        name: 'Classic Bridal',
        tag: 'Simple, elegant, effortless',
        includes: ['Bridal Hairstyling', 'HD Makeup', 'Draping Assistance', '1 Trial Session'],
        img: '/assets/images/pkg-classic.jpg',
        featured: false
      },
      {
        position: 2,
        name: 'Royal Bridal',
        tag: 'Our most complete bridal experience',
        includes: ['Airbrush HD Makeup', 'Premium Hair & Extensions', 'Draping + Jewelry Styling', '2 Trial Sessions', 'Dedicated Artist On Wedding Day'],
        img: '/assets/images/pkg-royal.jpg',
        featured: true
      },
      {
        position: 3,
        name: 'Premium Bridal',
        tag: 'Balanced glam and comfort',
        includes: ['HD + Airbrush Makeup', 'Advanced Hairstyling', 'Draping Assistance', '2 Trial Sessions'],
        img: '/assets/images/pkg-premium.jpg',
        featured: false
      }
    ];

    const lookbook = [
      { position: 1, caption: 'Bridal Glow', img: '/assets/images/look-1.jpg' },
      { position: 2, caption: 'Hair Artistry', img: '/assets/images/look-2.jpg' },
      { position: 3, caption: 'Makeup Magic', img: '/assets/images/look-3.jpg' },
      { position: 4, caption: 'Wedding Day', img: '/assets/images/look-4.jpg' },
      { position: 5, caption: 'Royal Finish', img: '/assets/images/look-5.jpg' }
    ];

    try {
      for (const p of packages) await this.firebaseService.addItem('bridalPackages', p);
      for (const l of lookbook) await this.firebaseService.addItem('bridalLookbook', l);

      await this.loadPackages();
      await this.loadLookbook();
    } catch (err) {
      console.error('Seed import failed:', err);
      this.packageErrorMsg = 'Import failed. Check your connection and try again.';
    } finally {
      this.packageUploading = false;
    }
  }

  // ===== PACKAGES =====

  async loadPackages() {
    const raw = await this.firebaseService.getAll('bridalPackages') as BridalPackage[];
    this.packages = raw.sort((a, b) => a.position - b.position);
  }

  onPackageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.packageSelectedFile = input.files[0];
      this.packagePreviewUrl = URL.createObjectURL(this.packageSelectedFile);
    }
  }

  async savePackage() {
    if (!this.newPackage.name || !this.newPackage.tag) {
      this.packageErrorMsg = 'Please fill in name and tagline.';
      return;
    }
    if (!this.editingPackageId && !this.packageSelectedFile) {
      this.packageErrorMsg = 'Please choose a photo.';
      return;
    }

    this.packageErrorMsg = '';
    this.packageUploading = true;

    try {
      let imgUrl = this.newPackage.img;
      if (this.packageSelectedFile) {
        imgUrl = await this.uploadToCloudinary(this.packageSelectedFile);
      }

      const includes = this.newPackage.includesText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const payload = {
        position: Number(this.newPackage.position),
        name: this.newPackage.name,
        tag: this.newPackage.tag,
        includes,
        img: imgUrl,
        featured: this.newPackage.featured
      };

      if (this.editingPackageId) {
        await this.firebaseService.updateItem('bridalPackages', this.editingPackageId, payload);
      } else {
        await this.firebaseService.addItem('bridalPackages', payload);
      }

      this.resetPackageForm();
      await this.loadPackages();
    } catch (err) {
      console.error('Package save failed:', err);
      this.packageErrorMsg = 'Something went wrong. Please try again.';
    } finally {
      this.packageUploading = false;
    }
  }

  editPackage(pkg: BridalPackage) {
    this.editingPackageId = pkg.id || null;
    this.newPackage = {
      position: pkg.position,
      name: pkg.name,
      tag: pkg.tag,
      includesText: (pkg.includes || []).join('\n'),
      img: pkg.img,
      featured: pkg.featured || false
    };
    this.packageSelectedFile = null;
    this.packagePreviewUrl = null;
  }

  cancelPackageEdit() {
    this.resetPackageForm();
  }

  async deletePackage(id: string | undefined) {
    if (!id) return;
    if (!confirm('Delete this package?')) return;
    await this.firebaseService.deleteItem('bridalPackages', id);
    await this.loadPackages();
  }

  private resetPackageForm() {
    this.editingPackageId = null;
    this.newPackage = { position: 1, name: '', tag: '', includesText: '', img: '', featured: false };
    this.packageSelectedFile = null;
    this.packagePreviewUrl = null;
  }

  // ===== LOOKBOOK =====

  async loadLookbook() {
    const raw = await this.firebaseService.getAll('bridalLookbook') as LookbookPhoto[];
    this.lookbook = raw.sort((a, b) => a.position - b.position);
  }

  onLookFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.lookSelectedFile = input.files[0];
      this.lookPreviewUrl = URL.createObjectURL(this.lookSelectedFile);
    }
  }

  async saveLook() {
  if (!this.newLook.caption) {
    this.lookErrorMsg = 'Please enter a caption.';
    return;
  }
  if (!this.editingLookId && !this.lookSelectedFile) {
    this.lookErrorMsg = 'Please select a photo.';
    return;
  }
  this.lookErrorMsg = '';
  this.lookUploading = true;

  try {
    let imgUrl = this.newLook.img;
    if (this.lookSelectedFile) {
      imgUrl = await this.uploadToCloudinary(this.lookSelectedFile);
    }

    if (this.editingLookId) {
      await this.firebaseService.updateItem('bridalLookbook', this.editingLookId, {
        caption: this.newLook.caption,
        img: imgUrl
      });
    } else {
      const nextPosition = this.lookbook.length > 0
        ? Math.max(...this.lookbook.map(l => l.position)) + 1
        : 1;

      await this.firebaseService.addItem('bridalLookbook', {
        position: nextPosition,
        caption: this.newLook.caption,
        img: imgUrl
      });
    }

    this.resetLookForm();
    await this.loadLookbook();
  } catch (err) {
    console.error('Lookbook save failed:', err);
    this.lookErrorMsg = 'Something went wrong. Please try again.';
  } finally {
    this.lookUploading = false;
  }
}
editLook(look: LookbookPhoto) {
  this.editingLookId = look.id || null;
  this.newLook = { caption: look.caption, img: look.img };
  this.lookSelectedFile = null;
  this.lookPreviewUrl = null;
}

cancelLookEdit() {
  this.resetLookForm();
}

private resetLookForm() {
  this.editingLookId = null;
  this.newLook = { caption: '', img: '' };
  this.lookSelectedFile = null;
  this.lookPreviewUrl = null;
}

  async deleteLook(id: string | undefined) {
    if (!id) return;
    if (!confirm('Delete this photo?')) return;
    await this.firebaseService.deleteItem('bridalLookbook', id);
    await this.loadLookbook();
  }

  // ===== SHARED =====

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