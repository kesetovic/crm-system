import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ContactsComponent } from "../contacts-component/contacts-component";
import { Auth } from '../_services/auth';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AddOrderComponent } from "../add-order-component/add-order-component";
import { MyOrdersComponent } from "../my-orders-component/my-orders-component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserPlus, faUser } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-home-component',
  imports: [MatTabsModule, ContactsComponent, MatButtonModule, AddOrderComponent, MyOrdersComponent, FontAwesomeModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent {
  authService = inject(Auth);
  private router = inject(Router);

  faUserPlus = faUserPlus;
  faUser = faUser;

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
