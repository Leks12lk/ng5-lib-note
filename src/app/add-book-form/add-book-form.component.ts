import { Component, OnInit, Input } from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import { IAppState } from "../store";
import { IBook } from "../interfaces/ibook.interface";
import { Priority } from "../models/priority";
import { Actions } from "../actions";
// ng-bootstrap modal
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from "@angular/forms/";
import { BookService } from "../services/book.service";
import { BookStatus } from "../models/book-status";

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-book-form',
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.scss']
})
export class AddBookFormComponent implements OnInit {  
  modalTitle: string;
  isEditMode: boolean;

  editedBook: IBook;
   
  @select((s:IAppState) => s.categories) categories$;
  @select((s:IAppState) => s.editedBook) editedBook$;

  date: any;
  time = {hour: 0, minute: 0};

  newBook: IBook = {
    title: '',
    author: '',
    categories: [],
    priority: Priority.Low,
    isRead: false,
    sendNotification: false,
    status: BookStatus.ToRead,
    notes: ''
  };

  model: IBook;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private bookService: BookService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.editedBook$.subscribe(editedBook => {
      if(editedBook !== null ) { // edit book
        // in order not to show at the table how fields are changing
        this.model = Object.assign({},editedBook);
        this.modalTitle = "Edit Book: " + editedBook.title;       
        this.editedBook = editedBook;
        this.isEditMode = true;

      } else { // adding new book
        this.model = this.newBook;
        this.modalTitle = "Add New Book";
        this.isEditMode = false;
      }
    });
  }

  addBook(addBookForm : NgForm) {
    if(this.isEditMode) {
      // in order to save the same object
      this.editedBook = Object.assign({}, this.model);
      this.bookService.updateBook(this.editedBook);
    } else {
      this.bookService.addBook(this.model);
    }    
    // reset the form values
    addBookForm.reset();
    // close the modal
    this.activeModal.close('Close click');
    // remove edited book from state
    this.ngRedux.dispatch({type: Actions.REMOVE_EDITED_BOOK});

    this.sendTestRequest();
  }

  addBookCategory(categoryName: string) {
    const categoriesArray = this.model.categories;
    categoriesArray.indexOf(categoryName) === -1 ? categoriesArray.push(categoryName) : null;
  }

  removeBookCategory(categoryName: string) {
    const categoriesArray = this.model.categories;
    categoriesArray.splice(categoriesArray.indexOf(categoryName), 1);
  }


  closeModal() {
    this.ngRedux.dispatch({type: Actions.REMOVE_EDITED_BOOK});
    this.activeModal.close('Close click');
  }


 httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  }

  configUrl = 'http://localhost/LibNoteApi/api/values';
  
  sendTestRequest() {
    debugger;
    return this.http.post(this.configUrl, {value:"hello world"}, this.httpOptions)
    .subscribe(user => console.log('done'));
  }

}
