import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// forms
import { FormsModule } from '@angular/forms';
// it enables javascript for bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// redux
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from './store';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BooksListComponent } from './books-list/books-list.component';
import { AddBookFormComponent } from './add-book-form/add-book-form.component';


@NgModule({
  declarations: [
    AppComponent,
    BooksListComponent,
    AddBookFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    NgReduxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}
