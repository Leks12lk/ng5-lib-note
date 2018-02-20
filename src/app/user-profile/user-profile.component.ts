import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from "../store";
import { NgForm } from "@angular/forms";
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  
  @select((s:IAppState) => s.categories) categories$;

  category: string;

  constructor(private userService: UserService) { 
  }

  ngOnInit() {
  }

  addCategory(categoryForm: NgForm) {
    this.userService.addCategory(this.category);
    // reset the form values
    categoryForm.reset();
  }

}
