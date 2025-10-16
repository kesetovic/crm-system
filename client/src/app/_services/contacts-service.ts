import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/environment.development';
import { CalleeDto } from '../_models/calleDto';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getContactsForUser() {
    return this.http.get<CalleeDto[]>(this.baseUrl + 'contacts/fetch');
  }

  addContactForUser(contact: any) {
    return this.http.post<CalleeDto>(this.baseUrl + 'contacts/add', contact, {});
  }

  deleteContact(id: string) {
    return this.http.delete(this.baseUrl + 'contacts/delete/' + id);
  }
}
