import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { BridalComponent } from './pages/bridal/bridal.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { BookingComponent } from './pages/booking/booking.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'bridal', component: BridalComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'contact', redirectTo: 'booking', pathMatch: 'full' },
  { path: 'booking', component: BookingComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }