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

@Component({
  selector: 'app-add-book-form',
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.scss']
})
export class AddBookFormComponent implements OnInit {  
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
    private activeModal: NgbActiveModal,
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
    this.activeModal.close('Close click');
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


  closeModal() {
    this.ngRedux.dispatch({type: Actions.REMOVE_EDITED_BOOK});
    this.activeModal.close('Close click');
  }

}
