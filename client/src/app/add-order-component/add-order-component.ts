import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddOrderDto } from '../_models/addOrderDto';
import { OrderService } from '../_services/order-service';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-order-component',
  imports: [MatCardModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './add-order-component.html',
  styleUrl: './add-order-component.css'
})
export class AddOrderComponent implements OnInit {

  orderForm!: FormGroup;
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      customerLastName: ['', Validators.required],
      customerAddress: ['', Validators.required],
      customerPhone: ['', [Validators.required, Validators.pattern(/^\+\d{6,15}$/)]],
      product: ['', Validators.required],
      orderPrice: [0, [Validators.required, Validators.min(0)]],
      orderNotes: [''],
    });
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.orderForm.valid) {
      const order: AddOrderDto = this.orderForm.value;
      this.orderService.addOrder(order).subscribe({
        next: response => {
          this.toastr.success(`Order ${response.orderId} added successfully`);
          formDirective.resetForm();
        },
        error: error => {
          this.toastr.error('Failed to add order : ' + error.message);
        }
      });
    }
  }

}
