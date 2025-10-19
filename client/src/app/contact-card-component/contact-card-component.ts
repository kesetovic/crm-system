import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faPhone, faHome, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CalleeDto } from '../_models/calleDto';
import { ContactsService } from '../_services/contacts-service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-contact-card-component',
  imports: [MatCardModule, MatButtonModule, FontAwesomeModule],
  templateUrl: './contact-card-component.html',
  styleUrl: './contact-card-component.css'
})
export class ContactCardComponent {
  private contactService = inject(ContactsService);
  private toastrService = inject(ToastrService);

  @Input() contact?: CalleeDto;
  @Output() contactDeleted = new EventEmitter<string>();
  faUser = faUser;
  faPhone = faPhone;
  faHome = faHome;
  faTrashCan = faTrashCan;

  removeContact(id: string) {
    this.contactService.deleteContact(id).subscribe({
      next: () => {
        this.toastrService.info('Contact removed successfully');
        this.contactDeleted.emit(this.contact?.calleeId);
      },
      error: (error) => {
        this.toastrService.error('Failed to remove contact: ' + error.message);
      }
    });
  }
}
