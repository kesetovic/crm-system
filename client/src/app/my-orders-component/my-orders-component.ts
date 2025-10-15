import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../_services/order-service';
import { PaginatedResult } from '../../_models/pagination';
import { OrderParams } from '../../_models/orderParams';
import { setPaginatedResponse, setPaginationHeaders } from '../../_helpers/paginationHelper';
import { ToastrService } from 'ngx-toastr';
import { MatCard } from "@angular/material/card";
import { MatCardTitle } from '@angular/material/card';
import { MatInputModule } from "@angular/material/input";
import { MatPaginator } from "@angular/material/paginator";
import { FormsModule } from '@angular/forms';
import { OrderDto } from '../../_models/orderDto';
import { OrderCardComponent } from "../order-card-component/order-card-component";
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-my-orders-component',
  imports: [MatCard, MatInputModule, MatCardTitle, MatPaginator, FormsModule, OrderCardComponent, MatButtonModule],
  templateUrl: './my-orders-component.html',
  styleUrl: './my-orders-component.css'
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toastr = inject(ToastrService);

  paginatedResult = signal<PaginatedResult<OrderDto[]> | null>(null);
  memberCache = new Map();
  name: string = "";
  orderParams = signal<OrderParams>(new OrderParams(this.name));
  displayedColumns: string[] = [
    'customerName',
    'product',
    'orderPrice',
    'orderDate',
    'orderStatus',
    'bonusAwarded'
  ];
  count: number = 0;


  ngOnInit() {
    this.getOrders();
  }


  resetOrderParams() {
    this.orderParams.set(new OrderParams(this.name));
  }
  resetFilters() {
    this.resetOrderParams();
    this.getOrders();
  }
  getOrders() {
    const response = this.memberCache.get(Object.values(this.orderParams()).join('-'));
    if (response) return setPaginatedResponse(response, this.paginatedResult);

    let params = setPaginationHeaders(this.orderParams().pageNumber, this.orderParams().pageSize);
    params = params.append('customerNameString', this.orderParams().customerNameString);
    params = params.append('minValue', this.orderParams().minValue ?? 0);
    params = params.append('maxValue', this.orderParams().maxValue ?? 10000);
    params = params.append('orderBy', this.orderParams().orderBy);
    this.orderService.getOrdersForUser(params).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.memberCache.set(Object.values(this.orderParams()).join('-'), response);
        if (this.count == 0) {
          this.toastr.info('Your orders data loaded successfully')
          this.count++;
        }
      }, error: error => {
        this.toastr.error('Something went wrong while loading your order data : ' + error.message);
      }
    });
  }

  pageChanged(event: any) {
    if (this.orderParams().pageNumber !== event.page) {
      this.orderParams().pageNumber = event.page;
      this.getOrders();
    }
  }

  setOrderBy(orderBy: string) {
    const currentParams = this.orderParams();
    currentParams.orderBy = orderBy;
    this.orderParams.set({ ...currentParams });
    this.getOrders();
  }
}
