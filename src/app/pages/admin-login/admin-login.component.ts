import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../core/firebase.service';

@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  async onLogin() {
    this.errorMsg = '';
    this.loading = true;
    try {
      await this.firebaseService.login(this.email, this.password);
      this.router.navigate(['/admin']);
    } catch (err: any) {
      this.errorMsg = 'Invalid email or password. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}