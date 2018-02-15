import { Component, OnInit, Input } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from "../store";
import { Book } from "../models/book";
import { Actions } from "../actions";
import { BookService } from "../services/book.service";
import { Observable } from "rxjs/Observable";
import { Priority } from "../models/priority";
import * as $ from 'jquery';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {
  modalRef: any;
  closeResult: string;
  books: Book[];
  @select((s:IAppState) => s.books) books$;
  @select((s:IAppState) => s.filteredBooks) filteredBooks$;  
  @Input() activeTab: string;

  @select() categoriesTags: string[];

  sortOrders = {
    title: 0,
    author: 0,
    priority: 0
  }

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private bookService: BookService) { }

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

  editBook(book, modal) {
    this.ngRedux.dispatch({type: Actions.ADD_EDITED_BOOK, editedBook: book});
    // click on add book button in order to open the modal with edited book data
    $('#addButton').trigger('click');
  }
  

  sort(property: string) {
    let sortOrder :number = this.sortOrders[property];
    
    let ascComparator = property === 'priority' 
      ? this.ascPriorityComparator : this.ascPropComparator;
   
    let descComparator = property === 'priority' 
       ? this.descPriorityComparator : this.descPropComparator;
    
    if(sortOrder === 0) {
      this.books.sort(ascComparator(property));
      this.sortOrders[property] = 1;
    } else if(sortOrder === 1)  {
      this.books.sort(descComparator(property));
      this.sortOrders[property] = -1;
    } else if(sortOrder === -1) {
      this.books.sort(ascComparator(property));
      this.sortOrders[property] = 1;
    }    
  }  

  ascPropComparator(propName) {
    return (a, b) => a[propName] === b[propName] ? 0 : a[propName] < b[propName] ? -1 : 1;
  }

  descPropComparator(propName) {
    return (a, b) => a[propName] === b[propName] ? 0 : a[propName] < b[propName] ? 1 : -1;
  }

  ascPriorityComparator() { 
    return function(a,b) {
      let x = a.priority === Priority.Low ? 0 : a.priority === Priority.Medium ? 1 : 2;
      let y = b.priority === Priority.Low ? 0 : b.priority === Priority.Medium ? 1 : 2;
      return x === y ? 0 : x < y ? -1 : 1;
    }   
  }

  descPriorityComparator() {
    return function(a,b) {
      let x = a.priority === Priority.Low ? 0 : a.priority === Priority.Medium ? 1 : 2;
      let y = b.priority === Priority.Low ? 0 : b.priority === Priority.Medium ? 1 : 2;
      return x === y ? 0 : x < y ? 1 : -1;
    }
  }


}
