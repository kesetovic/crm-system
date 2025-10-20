import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { OrderDto } from '../_models/orderDto';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../_services/order-service';
import { MatRippleModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-order-dumbcard-component',
  imports: [MatCardModule, MatChipsModule, DatePipe, CurrencyPipe, MatRippleModule, MatButtonModule, FontAwesomeModule],
  templateUrl: './order-dumbcard-component.html',
  styleUrl: './order-dumbcard-component.css'
})
export class OrderDumbCardComponent {
  @Input() order!: OrderDto;
  @Input() pack: boolean = false;
  @Input() cancel: boolean = false;
  @Input() complete: boolean = false;
  @Input() remove: boolean = false;

  faTrashCan = faTrashCan;

  @Output() emitChange = new EventEmitter<[event: string, id: string]>();

  onPack() {
    this.emitChange.emit(['pack', this.order.orderId]);
  }
  onCancel() {
    this.emitChange.emit(['cancel', this.order.orderId]);
  }

  onComplete() {
    this.emitChange.emit(['complete', this.order.orderId]);
  }
  onRemove() {
    this.emitChange.emit(['remove', this.order.orderId]);
  }

}
