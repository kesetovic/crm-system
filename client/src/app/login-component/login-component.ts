import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../_services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {
  authService = inject(Auth);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  model: any = {};

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.router.navigateByUrl('/home');
    }
  }

  login() {
    this.authService.login(this.model).subscribe({
      next: () => {
        this.toastr.success('Login successful');
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.toastr.error('Login failed: ' + err.error?.message || err.message || 'Unknown error');
      }
    });
  }
}
