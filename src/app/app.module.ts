import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { BridalComponent } from './pages/bridal/bridal.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { ContactComponent } from './pages/contact/contact.component';
import { BookingComponent } from './pages/booking/booking.component';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FloatingButtonsComponent } from './shared/floating-buttons/floating-buttons.component';
import { OffersComponent } from './pages/offers/offers.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminGalleryComponent } from './pages/admin-dashboard/admin-gallery/admin-gallery.component';
import { AdminServicesComponent } from './pages/admin-dashboard/admin-services/admin-services.component';
import { AdminOffersComponent } from './pages/admin-dashboard/admin-offers/admin-offers.component';
import { AdminHomeGalleryComponent } from './pages/admin-dashboard/admin-home-gallery/admin-home-gallery.component';
import { AdminBridalComponent } from './pages/admin-dashboard/admin-bridal/admin-bridal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ServicesComponent,
    BridalComponent,
    GalleryComponent,
    ContactComponent,
    BookingComponent,
    NavbarComponent,
    FooterComponent,
    FloatingButtonsComponent,
    OffersComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminGalleryComponent,
    AdminServicesComponent,
    AdminOffersComponent,
    AdminHomeGalleryComponent,
    AdminBridalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }