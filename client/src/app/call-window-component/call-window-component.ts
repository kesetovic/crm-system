import { Component, Inject, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { TwilioService } from '../_services/twilio-service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-call-window-component',
  imports: [MatButtonModule, DatePipe],
  templateUrl: './call-window-component.html',
  styleUrl: './call-window-component.css'
})
export class CallWindowComponent implements OnInit, OnDestroy {
  private toastr = inject(ToastrService);

  @Input() contactNumber = '';

  isMuted = false;
  callTime = 0;
  status = 'Calling...'
  private timer?: any;
  private twilioService = inject(TwilioService);


  constructor(
    private dialogRef: MatDialogRef<CallWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contactNumber: string },
  ) {
    this.contactNumber = data.contactNumber;
  }

  ngOnInit(): void {
    if (!this.contactNumber) return

    const conn = this.twilioService.callPhoneNumber(this.contactNumber);
    conn.then(conn => {
      conn.on('accept', () => {
        this.status = 'In call';
        this.startTimer();
      });
      conn.on('disconnect', () => {
        this.status = 'Call ended';
        this.stopTimer();
        setTimeout(() => {
          this.dialogRef.close();
        }, 2000);
      });
      conn.on('cancel', () => {
        this.status = 'Call cancelled';
        this.stopTimer();
      });
      conn.on('error', () => {
        this.stopTimer();
        setTimeout(() => {
          this.dialogRef.close();
        }, 2000);
      });
    })

  }

  hangup(): void {
    this.twilioService.hangup();
    this.stopTimer();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.twilioService.toggleMute(this.isMuted);
  }

  private startTimer() {
    this.callTime = 0;
    this.timer = setInterval(() => this.callTime += 1000, 1000);
  }

  private stopTimer() {
    if (this.timer) clearInterval(this.timer);
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
