import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  uname:String ="";
  password:String ="";
  constructor(private router: Router) { }

  ngOnInit() {
  }
  onSubmit(){
    if(this.password.length > 4){
      this.router.navigateByUrl('/listing');
    }else{
      console.log("password was" + this.password);
    }
  }
}
