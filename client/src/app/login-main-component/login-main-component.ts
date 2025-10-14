import { Component } from '@angular/core';
import { ParticlesComponent } from "../particles-component/particles-component";
import { LoginComponent } from "../login-component/login-component";

@Component({
  selector: 'app-login-main-component',
  imports: [ParticlesComponent, LoginComponent],
  templateUrl: './login-main-component.html',
  styleUrl: './login-main-component.css'
})
export class LoginMainComponent {

}
