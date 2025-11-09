import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment.development';
import { Device } from '@twilio/voice-sdk';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private device?: Device
  private baseUrl = environment.apiUrl;
  public currentConnection?: any;

  async init(identity: string): Promise<void> {
    const res: any = await
      this.http.get(`${this.baseUrl}call/token?identity=${identity}`).toPromise();

    this.device = new Device(res.token, {
      logLevel: 'debug'
    })

    this.device.on('ready', () => this.toastr.success('Twilio Device is ready'));
    this.device.on('error', (error) => this.toastr.error(`Twilio Device error: ${error.message}`));
    this.device.on('disconnect', () => {
      this.currentConnection = undefined;
      this.toastr.info('Call ended')
    });
  }

  async callPhoneNumber(phoneNumber: string) {
    if (!this.device) throw new Error('Twilio Device is not initialized');

    this.currentConnection = await this.device.connect({ params: { To: phoneNumber } });
    this.currentConnection.on('accept', () => this.toastr.success(`Call connected`));
    this.currentConnection.on('disconnect', () => this.toastr.info(`Call finished`));
    this.currentConnection.on('cancel', () => this.toastr.info(`Call cancelled`));
    this.currentConnection.on('error', (error: any) => this.toastr.error(`Connection error: ${error.message}`));

    return this.currentConnection
  }

  hangup(): void {
    this.currentConnection?.disconnect();
    this.currentConnection = undefined;
  }

  mute() {
    this.currentConnection?.mute(true);
  }

  unmute() {
    this.currentConnection?.mute(false);
  }

  toggleMute(isMuted: boolean) {
    this.currentConnection?.mute(isMuted);
  }

}
