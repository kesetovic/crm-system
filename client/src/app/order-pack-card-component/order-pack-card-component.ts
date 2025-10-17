import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { OrderDto } from '../_models/orderDto';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../_services/order-service';
import { MatRippleModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-order-pack-card-component',
  imports: [MatCardModule, MatChipsModule, DatePipe, CurrencyPipe, MatRippleModule, MatButtonModule],
  templateUrl: './order-pack-card-component.html',
  styleUrl: './order-pack-card-component.css'
})
export class OrderPackCardComponent {
  private orderService = inject(OrderService);
  private toastr = inject(ToastrService);
  @Input() order!: OrderDto;
  @Output() emitEvent = new EventEmitter<boolean>();

  onPack(id: string) {
    this.orderService.markPacked(id).subscribe({
      next: _ => {
        this.toastr.success(`Order ${id} packed.`);
        this.emitEvent.emit(true);
      },
      error: error => {
        this.toastr.error(`Error packing order ${id} : ` + error.message);
      }
    })
  }
  onCancel(id: string) {
    this.orderService.markCancelled(id).subscribe({
      next: _ => {
        this.toastr.info(`Order ${id} cancelled.`);
        this.emitEvent.emit(true);
      },
      error: error => {
        this.toastr.error(`Error cancelling order ${id} : ` + error.message);
      }
    })
  }
}
