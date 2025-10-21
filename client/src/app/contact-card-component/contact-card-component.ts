import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faPhone, faHome, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CalleeDto } from '../_models/calleDto';
@Component({
  selector: 'app-contact-card-component',
  imports: [MatCardModule, MatButtonModule, FontAwesomeModule],
  templateUrl: './contact-card-component.html',
  styleUrl: './contact-card-component.css'
})
export class ContactCardComponent {
  @Input() contact?: CalleeDto;
  @Output() contactDeleted = new EventEmitter<string>();
  @Output() call = new EventEmitter<string>();
  faUser = faUser;
  faPhone = faPhone;
  faHome = faHome;
  faTrashCan = faTrashCan;

  removeContact() {
    this.contactDeleted.emit(this.contact?.calleeId);
  }
  callContact() {
    console.log('Callee' + this.contact?.calleeId);
    this.call.emit(this.contact?.calleeId);
  }
}
