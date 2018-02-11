import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from "../store";
import { Book } from "../models/book";
import { Actions } from "../actions";
import { BookService } from "../services/book.service";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {
  @select((s:IAppState) => s.books) books$;
  //books: Observable<Book[]>;
 // books: Book[];

  @select() categoriesTags: string[];

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private bookService: BookService) {
     }

  ngOnInit() {
     //this.books = this.bookService.getBooks();
     //this.books = this.getBooks();
  }

  // ngDoCheck() {
  //   this.books = this.bookService.getBooks();
  // }

  removeBook(book) {
    //this.ngRedux.dispatch({type: Actions.REMOVE_BOOK, id: book.id})
  }

  toggleReadStatus(book) {
    //this.ngRedux.dispatch({type: Actions.TOGGLE_READ_STATUS, id: book.id})
  }

  editBook(book) {
    alert('Here will be modal to edit book with a title ' + book.title);
  }

  getBooks() {
    //return this.bookService.getBooks();
  }

}
