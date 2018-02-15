import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  email: string;
  password: string;
  errorMsg: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    console.log('login() called from login-form component');
    this.authService.login(this.email, this.password)
    .catch(error => this.errorMsg = error.message);
  }

}
