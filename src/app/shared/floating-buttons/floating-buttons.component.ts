import { Component } from '@angular/core';

@Component({
  selector: 'app-floating-buttons',
  standalone: false,
  templateUrl: './floating-buttons.component.html',
  styleUrls: ['./floating-buttons.component.css']
})
export class FloatingButtonsComponent {
  defaultMsg = encodeURIComponent("Hi Eleven 11! I'd like to know more about your services.");
}