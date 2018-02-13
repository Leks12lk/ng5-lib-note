import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import {IAppState} from '../store';
import { Book } from "../models/book";
import { Actions } from "../actions";
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-search-block',
  templateUrl: './search-block.component.html',
  styleUrls: ['./search-block.component.scss']
})
export class SearchBlockComponent implements OnInit {
  @select() filteredBooks;

  constructor(
    private ngRedux: NgRedux<IAppState>
  ) { }

  ngOnInit() {
    console.log("+", this.filteredBooks);
  }

  filterBook(term: string) {
    this.ngRedux.dispatch({type: Actions.SEARCH_BOOK, term: term});
  }
}
