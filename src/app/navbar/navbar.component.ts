import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AuthService } from "../services/auth.service";
import * as firebase from 'firebase/app';
import {select} from '@angular-redux/store';
import {IAppState} from '../store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: Observable<firebase.User>;
  @select((s:IAppState) => s.user) user$;
  logo: string = "assets/image/beta-logo.png";
  logoRoute: string = "/login";
  userEmail: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.authUser();
    this.user.subscribe(user => {
      if (user) {
        this.userEmail = user.email;
        this.logoRoute = "/books";
      }
    });
  }

  logout() {
    this.authService.logout();
    this.logoRoute = "/login"
  }
}
