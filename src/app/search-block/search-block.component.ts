import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import {IAppState} from '../store';
import { Actions } from "../actions";

interface ISearchTerms {
  textTerm: string,
  priorityTerm: string,
  categoryTerm: string[]
}

@Component({
  selector: 'app-search-block',
  templateUrl: './search-block.component.html',
  styleUrls: ['./search-block.component.scss']
})
export class SearchBlockComponent implements OnInit {
  @select((s:IAppState) => s.categories) categories$;
  selectedCategories: string[] = [];

  constructor(
    private ngRedux: NgRedux<IAppState>
  ) { }

  ngOnInit() {
  }

  filterBook(searchTerms: ISearchTerms) {
    this.ngRedux.dispatch({type: Actions.SEARCH_BOOK, searchTerms: searchTerms});
  }

  toggleSelectedCategory(searchTerms, categoryName) {
    this.selectedCategories.indexOf(categoryName) === -1
      ? this.selectedCategories.push(categoryName)
      : this.selectedCategories.splice(this.selectedCategories.indexOf(categoryName), 1);
    this.filterBook(searchTerms);
  }

  ifSelected(target: string) {
    return this.selectedCategories.indexOf(target) === -1 ? "btn-primary" : "btn-success";
  }
}
