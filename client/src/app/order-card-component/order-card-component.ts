import { Component, Input } from '@angular/core';
import { OrderDto } from '../../_models/orderDto';
import { MatCard, MatCardModule } from "@angular/material/card";
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-order-card-component',
  imports: [MatCard, MatCardModule, CurrencyPipe, DatePipe, MatButtonModule, MatChipsModule, CommonModule, MatRippleModule],
  templateUrl: './order-card-component.html',
  styleUrl: './order-card-component.css'
})
export class OrderCardComponent {

  @Input() order!: OrderDto;
}
