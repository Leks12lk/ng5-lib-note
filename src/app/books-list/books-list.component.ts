import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from "../store";
import { Book } from "../models/book";
import { Actions } from "../actions";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {
  @select() books: Book[];

  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
  }

  removeBook(book) {
    this.ngRedux.dispatch({type: Actions.REMOVE_BOOK, id: book.id})
  }

  toggleReadStatus(book) {
    this.ngRedux.dispatch({type: Actions.TOGGLE_READ_STATUS, id: book.id})
  }

  editBook(book) {
    alert('Here will be modal to edit book with a title ' + book.title);
  }

}
