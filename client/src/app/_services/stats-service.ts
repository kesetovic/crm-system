import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OrderSummaryDto } from '../_models/orderSummaryDto';
import { environment } from '../../env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getUserSummary() {
    return this.http.get<OrderSummaryDto>(this.baseUrl + 'stats/fetch');
  }
}
