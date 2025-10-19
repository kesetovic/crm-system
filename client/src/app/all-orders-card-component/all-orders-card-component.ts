import { DatePipe, CurrencyPipe } from '@angular/common';
import { afterNextRender, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { OrderDto } from '../_models/orderDto';
import { OrderService } from '../_services/order-service';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-all-orders-card-component',
  imports: [MatCardModule, MatChipsModule, DatePipe, CurrencyPipe, MatRippleModule, MatButtonModule, FontAwesomeModule],
  templateUrl: './all-orders-card-component.html',
  styleUrl: './all-orders-card-component.css'
})
export class AllOrdersCardComponent {
  private orderService = inject(OrderService);
  private toastr = inject(ToastrService);
  @Input() order!: OrderDto;
  @Output() emitEvent = new EventEmitter<boolean>();

  faTrashCan = faTrashCan;

  onComplete(id: string) {
    this.orderService.markCompleted(id).subscribe({
      next: _ => {
        this.toastr.success(`Order ${id} completed.`);
        this.emitEvent.emit(true);
      },
      error: error => {
        this.toastr.error(`Error completing order ${id} : ` + error.message);
      }
    })
  }
  onCancel(id: string) {
    this.orderService.markCancelled(id).subscribe({
      next: _ => {
        this.toastr.warning(`Order ${id} cancelled.`);
        this.emitEvent.emit(true);
      },
      error: error => {
        this.toastr.error(`Error cancelling order ${id} : ` + error.message);
      }
    })
  }

  onRemove(id: string) {
    if (confirm(`Are you sure you want to delete order ${id}`)) {
      this.orderService.removeOrder(id).subscribe({
        next: _ => {
          this.toastr.info(`Order ${id} removed.`);
          this.emitEvent.emit(true);
        },
        error: error => {
          this.toastr.error(`Error removing order ${id} :` + error.message);
        }
      })
    }
  }
}
