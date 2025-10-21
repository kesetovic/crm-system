import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  callContact(from: string, to: string) {
    return this.http.post(this.baseUrl + 'call/call-contact', {
      appUserId: from,
      contactId: to
    });
  }
}
