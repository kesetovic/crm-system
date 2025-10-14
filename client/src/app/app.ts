import { Component, inject, OnInit } from '@angular/core';
import { NgxSpinnerComponent } from "ngx-spinner";
import { RouterOutlet } from '@angular/router';
import { Auth } from './_services/auth';
import { provideAnimations } from '@angular/platform-browser/animations';
@Component({
  selector: 'app-root',
  imports: [NgxSpinnerComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  authService = inject(Auth);

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.authService.setCurrentUser(user);
  }
}
