import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr'
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private toastr = inject(ToastrService);
  public orderSignal$ = new Subject<void>();

  private connected = false;

  startConnection() {
    if (this.connected) return;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5054/ordersHub', {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(_ => this.toastr.info('Connected to main hub'))
      .catch(err => this.toastr.warning('Hub connection error: ', err.message));

    this.hubConnection.on('OrderSignal', () => {
      this.orderSignal$.next();
    });
  }
}
