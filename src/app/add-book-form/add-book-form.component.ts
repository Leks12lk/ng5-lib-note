import { Component, OnInit } from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import { IAppState } from "../store";
import { IBook } from "../interfaces/ibook.interface";
import { Priority } from "../models/priority";
import { Actions } from "../actions";
// ng-bootstrap modal
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from "@angular/forms/";
import { BookService } from "../services/book.service";
import { BookStatus } from "../models/book-status";

@Component({
  selector: 'app-add-book-form',
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.scss']
})
export class AddBookFormComponent implements OnInit {
  closeResult: string;
  modalRef: any;
  modalTitle: string;
  isEditMode: boolean;
   
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
    private bookService: BookService) { }

  ngOnInit() {
    this.editedBook$.subscribe(editedBook => {      
      if(editedBook !== null ) { // edit book
        this.model = editedBook;
        this.modalTitle = "Edit Book: " + editedBook.title;
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
      this.bookService.updateBook(this.model);
    } else {
      this.bookService.addBook(this.model);
    }    
    // reset the form values
    addBookForm.reset();
    // close the modal
    this.modalRef.close();
    // remove edited book from state
    this.ngRedux.dispatch({type: Actions.REMOVE_EDITED_BOOK});
  }

  addBookCategory(categoryName: string) {
    const categoriesArray = this.model.categories;
    categoriesArray.indexOf(categoryName) === -1 ? categoriesArray.push(categoryName) : null;
  }

  removeBookCategory(categoryName: string) {
    const categoriesArray = this.model.categories;
    categoriesArray.splice(categoriesArray.indexOf(categoryName), 1);
  }

  open(content) {
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // remove edited book from state
      this.ngRedux.dispatch({type: Actions.REMOVE_EDITED_BOOK});
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // remove edited book from state
      this.ngRedux.dispatch({type: Actions.REMOVE_EDITED_BOOK});
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
