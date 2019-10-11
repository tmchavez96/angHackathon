import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-bank-login',
  templateUrl: './bank-login.component.html',
  styleUrls: ['./bank-login.component.css']
})
export class BankLoginComponent implements OnInit {

  private loginForm: FormGroup;
  private failed: boolean;

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', { validators: [Validators.required] }),
      password: new FormControl('', { validators: [Validators.required] })
    });
    this.failed = false;
    if (this.auth.isLoggedIn) {
      this.router.navigateByUrl('/banker');
    }
  }

  onSubmit() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.username;
    this.auth.login(username, password).subscribe((result) => {
      this.auth.setSession(result);
    },
    (err) => {
      this.failed = true;
    },
    () => {
      this.router.navigateByUrl('/banker');
    });
  }

}
