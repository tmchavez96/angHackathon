import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CheckService } from '../shared/check.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {

  private checkForm: FormGroup;

  private sentRequest: boolean;
  private notFound: boolean;
  private pending: boolean;
  private denied: boolean;
  private approved: boolean;
  private cardHeader: string;
  private statusMsg: string;

  constructor(private service: CheckService) { }

  ngOnInit() {
    this.reset();
    this.checkForm = new FormGroup({
      appId: new FormControl('', { validators: [Validators.required] })
    });
  }

  get appId() {
    return this.checkForm.get('appId');
  }

  onSubmit() {

    const id = this.appId.value;

    this.service.checkStatus(id).subscribe((result) => {
      if (result) {
        // we are expecting a status property in the result JSON object
        switch (result['status']) {
          case -1:
            this.denied = true;
            this.cardHeader = 'Denied';
            this.statusMsg = 'Your application has been denied.';
            break;
          case 0:
            this.pending = true;
            this.cardHeader = 'Pending';
            this.statusMsg = 'Your application is still being reviewed.';
            break;
          case 1:
            this.approved = true;
            this.cardHeader = 'Approved!';
            this.statusMsg = 'Your application has been approved!';
            break;
        }
      } else {
        this.notFound = true;
      }
    },
    (err) => { // called when an error code is returned
      console.error(err);
      this.sentRequest = false;
      this.notFound = true;
      this.cardHeader = 'Invalid ID, please try again.';
    }
    ,
    () => { // called when successful, this will be skipped if there is an error
      this.sentRequest = false;
      this.checkForm.reset();
    });

    this.sentRequest = true;
  }

  reset() {
    this.sentRequest = false;
    this.notFound = false;
    this.pending = false;
    this.denied = false;
    this.approved = false;
    this.cardHeader = 'Please enter your application ID';
    this.statusMsg = '';
  }

}
