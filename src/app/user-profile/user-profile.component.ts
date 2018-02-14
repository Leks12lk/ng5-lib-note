import { Component, OnInit } from '@angular/core';
import { BookService } from "../services/book.service";
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from "../store";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  
  @select((s:IAppState) => s.categories) categories$;

  category: string;

  constructor(private bookService: BookService) { 
  }

  ngOnInit() {
  }

  addCategory(categoryForm: NgForm) {
    this.bookService.addCategory(this.category);
    // reset the form values
    categoryForm.reset();
  }

}
