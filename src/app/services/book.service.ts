import { Injectable } from "@angular/core";
import { FirebaseListObservable  } from 'angularfire2/database-deprecated';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Book } from "../models/book";
import { Observable } from "rxjs/Observable";


@Injectable()
export class BookService {
    books: Book[] = null;
    userId: string;

    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
        this.afAuth.authState.subscribe(user => {
            if(user) this.userId = user.uid;
        });

       this.getBooks().subscribe((books: Book[]) => {
           this.books = books;
       })
    }

  // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  getBooks() {
    if (!this.userId) return;
    return this.db.list(`books/${this.userId}`).valueChanges();
  }

  addBook(book: Book)  {
    this.books.push(book)
  }
}

