import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import {IAppState} from '../store';
import { BookService } from "../services/book.service";
import {Priority} from '../models/priority';
import { Actions } from "../actions";


@Component({
  selector: 'app-search-block',
  templateUrl: './search-block.component.html',
  styleUrls: ['./search-block.component.scss']
})
export class SearchBlockComponent implements OnInit {
  //@select() filteredBooks;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    //private bookService: BookService
  ) { }

  ngOnInit() {
  }

  filterBook(textTerm: string, priorityTerm: string) {
    this.ngRedux.dispatch({type: Actions.SEARCH_BOOK, textTerm: textTerm, priorityTerm: priorityTerm});
  }

  // selectPriority(selectTerm: string, searchTerm: string) {
  //   this.bookService.getBooks(selectTerm);
  //   this.filterBook(searchTerm);
  // }

  // priorityCSSClass(option: Priority) {
  //   switch (option) {
  //     case Priority.Low:
  //       return 'btn-success';
  //     case Priority.Medium:
  //       return 'btn-warning';
  //     case Priority.High:
  //       return 'btn-danger';
  //     default:
  //       return 'btn-default';
  //   }
  // }
}
