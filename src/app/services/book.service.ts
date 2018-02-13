import { Injectable } from "@angular/core";
import { FirebaseListObservable  } from 'angularfire2/database-deprecated';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Book } from "../models/book";
import { Observable } from "rxjs/Observable";
import { NgRedux } from "@angular-redux/store/lib/src";
import { IAppState } from "../store";
import { Actions } from "../actions";

import * as firebase from 'firebase/app';


@Injectable()
export class BookService {
    books: Book[] = null;
    userId: string;
    user: firebase.User;

    constructor (
      private db: AngularFireDatabase,
      private afAuth: AngularFireAuth,
      private ngRedux: NgRedux<IAppState>
    ) {
      this.afAuth.authState.subscribe(user => {
        console.log('books servive user', user);
        if(user !== undefined && user !== null) {
          this.user = user;
          this.userId = user.uid;
          this.getBooks("");
        }

        // this.getUser().subscribe((user) => {
        //   this.userName = user.displayName;
        // });
      });

      // this.getBooks1().subscribe(books => {
      //   this.books = books;
      // })

    }

  // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  getBooks(selectTerm): Observable<Book[]> {
    // var userId = '';
    // if(this.user) {
    //   userId = this.user.uid;
    // }
    console.log('getBooks', this.userId);
    if (!this.userId ) return;
    this.db.list(`books/${this.userId}`).valueChanges().subscribe(books => {
      this.ngRedux.dispatch({type: Actions.LOAD_BOOKS, books: books, selectTerm: selectTerm});
    })

  }


  addBook(book: Book)  {
    //var userId = this.user.uid
    console.log('addBook', this.userId);
    if (!this.userId) return;
    this.db.list(`books/${this.userId}`).push(book);
    this.ngRedux.dispatch({type: Actions.ADD_BOOK, book: book})
  }

  // getUser(): any {
  //   let userId = this.user.uid;
  //   let path = `/users/${userId}`;
  //   return this.db.object(path).valueChanges();
  // }
}

