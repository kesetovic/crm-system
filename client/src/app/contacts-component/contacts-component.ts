import { Component, inject, OnInit } from '@angular/core';
import { ContactCardComponent } from "../contact-card-component/contact-card-component";
import { Callee } from '../../_models/callee';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AddContactDialogComponent } from '../add-contact-dialog-component/add-contact-dialog-component';
import { CalleeDto } from '../../_models/calleDto';
import { ContactsService } from '../_services/contacts-service';
import { ToastrService } from 'ngx-toastr';
import { AddCalleeDto } from '../../_models/addCalleeDto';
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-contacts-component',
  imports: [ContactCardComponent, MatButtonModule, MatDialogModule, MatInputModule],
  templateUrl: './contacts-component.html',
  styleUrl: './contacts-component.css'
})
export class ContactsComponent implements OnInit {
  private contactsService = inject(ContactsService);
  private toastrService = inject(ToastrService);
  private dialog: MatDialog = inject(MatDialog);

  contacts: CalleeDto[] = [];
  contactsCache: CalleeDto[] = [];
  filterText: string = '';

  ngOnInit(): void {
    this.contactsService.getContactsForUser().subscribe({
      next: _contacts => {
        this.contacts = _contacts as CalleeDto[];
        this.toastrService.success('Contacts loaded successfully');
        this.contactsCache = [...this.contacts];
      },
      error: error => {
        this.toastrService.error('Failed to load contacts: ' + error.message);
      }
    })
  }

  openAddContactDialog(): void {
    const dialogRef = this.dialog.open(AddContactDialogComponent, {
      width: '400px', disableClose: true
    });


    dialogRef.afterClosed().subscribe((result: any | null) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.contactsService.addContactForUser(result).subscribe({
          next: (newContact) => {
            this.contacts.push(newContact);
            this.filterContacts();
            this.toastrService.success('Contact added successfully');
          },
          error: (error) => {
            this.toastrService.error('Failed to add contact: ' + error.message);
          }
        });
      }
    });
  }

  onContactDeleted(deletedContactId: string): void {
    this.contacts = this.contacts.filter(c => c.calleeId !== deletedContactId);
    this.filterContacts();
  }

  onFilterChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.filterText = input;
    this.filterContacts();
  }

  private filterContacts(): void {
    const filter = this.filterText.toLowerCase();
    this.contactsCache = this.contacts.filter(contact =>
      contact.firstName.toLowerCase().concat(" ").concat(contact.lastName.toLowerCase()).includes(filter)
    );
  }
}
