import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// forms
import { FormsModule } from '@angular/forms';
// it enables javascript for bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// redux
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from './store';
//routing
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BooksListComponent } from './books-list/books-list.component';
import { AddBookFormComponent } from './add-book-form/add-book-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { AuthService } from "./services/auth.service";
import { BookService } from "./services/book.service";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireModule } from "angularfire2";
import { environment } from "../environments/environment";
import { BooksComponent } from './books/books.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    BooksListComponent,
    AddBookFormComponent,
    RegisterFormComponent,
    LoginFormComponent,
    BooksComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    NgReduxModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    AuthService,
    BookService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}
