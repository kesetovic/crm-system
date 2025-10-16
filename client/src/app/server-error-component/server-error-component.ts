import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error-component',
  imports: [MatButtonModule],
  templateUrl: './server-error-component.html',
  styleUrl: './server-error-component.css'
})
export class ServerErrorComponent {
  private router = inject(Router);
  goHome() {
    this.router.navigateByUrl('/home');
  }
}
