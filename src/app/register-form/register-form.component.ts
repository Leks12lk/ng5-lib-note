import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  email: string;
  password: string;
  userName: string;
  errorMessage: string;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  register() {
    //console.log(this.email, this.password, this.userName);
    this.authService.register(this.email, this.password, this.userName)
      .then(resolve => this.router.navigate(['books']))
      .catch(error => this.errorMessage = error.message);    
  }

}
