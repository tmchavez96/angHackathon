import { Component, OnInit } from '@angular/core';
import { BankApprovalService } from './bank-approval.service';

@Component({
  selector: 'app-bank-approval',
  templateUrl: './bank-approval.component.html',
  styleUrls: ['./bank-approval.component.css']
})
export class BankApprovalComponent implements OnInit {

  private arr;
  private loadedList: boolean;

  constructor(private service: BankApprovalService) { }

  ngOnInit() {
    this.loadedList = false;

    this.service.getPendingApps().subscribe((result) => {
      this.arr = result;
      for (let i = 0; i < this.arr.length; i++) {
        this.arr[i].status = 'none';
      }
    },
    (err) => {
      this.loadedList = false;
    },
    () => {
      this.loadedList = true;
    });
  }

  actOnApplication(app: any, approve: boolean) {
    app.status = 'waiting';
    this.service.actOnApplication(app.SSN, approve).subscribe((result) => {
    },
    (err) => {
      app.status = 'none';
    },
    () => {
      app.status = approve ? 'approved' : 'denied';
    });
  }

}
