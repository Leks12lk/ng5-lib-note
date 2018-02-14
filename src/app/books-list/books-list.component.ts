import { Component, OnInit, Input } from '@angular/core';
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
  books: Book[];
  @select((s:IAppState) => s.books) books$;
  @select((s:IAppState) => s.filteredBooks) filteredBooks$;  
  @Input() activeTab: string;

  @select() categoriesTags: string[];

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private bookService: BookService) {
    }

  ngOnInit() {
     this.filteredBooks$.subscribe(books => {
       if(this.activeTab === 'all') {
        this.books = books;
       } else {
        this.books = books.filter(b => b.status.toString() === this.activeTab);
       }
     });
  }

  removeBook(book) {
    //this.ngRedux.dispatch({type: Actions.REMOVE_BOOK, id: book.id})
  }

  toggleReadStatus(book) {
    //this.ngRedux.dispatch({type: Actions.TOGGLE_READ_STATUS, id: book.id})
  }

  editBook(book) {
    alert('Here will be modal to edit book with a title ' + book.title);
  }

  sort(property: string) {
    console.log('sort', property);
    this.books.sort(this.descPropComparator(property));
  }

  // compare(a,b, property) {
  //   if (a[property] < b[property])
  //     return -1;
  //   if (a[property] > b[property])
  //     return 1;
  //   return 0;
  // }

  ascPropComparator(propName) {
    return (a, b) => a[propName] == b[propName] ? 0 : a[propName] < b[propName] ? -1 : 1;
  }

  descPropComparator(propName) {
    return (a, b) => a[propName] == b[propName] ? 0 : a[propName] < b[propName] ? 1 : -1;
  }


}
