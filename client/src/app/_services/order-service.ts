import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment.development';
import { OrderDto } from '../_models/orderDto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  addOrder(model: any) {
    return this.http.post<OrderDto>(this.baseUrl + 'order/add', model, {});
  }

  getOrdersForUser(params: any) {
    return this.http.get<OrderDto[]>(this.baseUrl + 'order/fetch', { observe: 'response', params });
  }

  getOrdersToPack(params: any) {
    return this.http.get<OrderDto[]>(this.baseUrl + 'order/fetch/topack', { observe: 'response', params });
  }

  markPacked(id: string) {
    return this.http.put(this.baseUrl + 'order/' + id + '/pack', {});
  }

  markCancelled(id: string) {
    return this.http.put(this.baseUrl + 'order/' + id + '/cancel', {});
  }

  markCompleted(id: string) {
    return this.http.put(this.baseUrl + 'order/' + id + '/complete', {});
  }
}
