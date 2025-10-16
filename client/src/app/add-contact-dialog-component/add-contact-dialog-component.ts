import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { AddCalleeDto } from '../_models/addCalleeDto';


@Component({
  selector: 'app-add-contact-dialog-component',
  imports: [MatInputModule, MatDialogContent, MatFormFieldModule, MatLabel, MatDialogModule, ReactiveFormsModule, MatButtonModule, NgIf, FormsModule],
  templateUrl: './add-contact-dialog-component.html',
  styleUrl: './add-contact-dialog-component.css'
})
export class AddContactDialogComponent implements OnInit {

  contactForm!: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  private dialogRef: MatDialogRef<AddContactDialogComponent> = inject(MatDialogRef);

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    })
  }

  onSave(): void {
    if (this.contactForm.valid) {
      const contact: AddCalleeDto = this.contactForm.value;
      this.dialogRef.close(contact);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
