import { Component } from '@angular/core';
import { ParticlesComponent } from './particles-component/particles-component';

@Component({
  selector: 'app-root',
  imports: [ParticlesComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
