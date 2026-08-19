import { Component, OnInit } from '@angular/core';

interface Sparkle {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  sparkles: Sparkle[] = [];

  ngOnInit() {
    this.sparkles = Array.from({ length: 35 }, () => ({
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      size: (Math.random() * 2.5 + 1).toFixed(1) + 'px',
      delay: (Math.random() * 5).toFixed(1) + 's',
      duration: (Math.random() * 2.5 + 2).toFixed(1) + 's'
    }));
  }
}