import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found-component',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './not-found-component.html',
  styleUrl: './not-found-component.css'
})
export class NotFoundComponent {
  private router = inject(Router);
  goHome() {
    this.router.navigateByUrl('/home');
  }
}
