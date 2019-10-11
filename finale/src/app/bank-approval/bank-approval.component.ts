import { Component, OnInit } from '@angular/core';
import { BankApprovalService } from '../shared/bank-approval.service';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-approval',
  templateUrl: './bank-approval.component.html',
  styleUrls: ['./bank-approval.component.css']
})
export class BankApprovalComponent implements OnInit {

  private arr;
  private loadedList: boolean;
  private authorized: boolean;

  constructor(private service: BankApprovalService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.loadedList = false;
    this.authorized = true;

    if (this.auth.isLoggedIn) {
      this.service.getPendingApps().subscribe((result) => {
        this.arr = result;
        for (let i = 0; i < this.arr.length; i++) {
          this.arr[i].status = 'none';
        }
      },
      (err) => { 
        const code = err['status'];
        if (code == 401) {
          this.authorized = false;
        }
      },
      () => {
        this.loadedList = true;
      });
    } else {
      this.router.navigateByUrl('/bankerlogin');
    }
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
