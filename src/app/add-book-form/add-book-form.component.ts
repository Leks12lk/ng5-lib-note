import { Component, OnInit, Input } from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import { IAppState } from "../store";
import { IBook } from "../interfaces/ibook.interface";
import { Priority } from "../models/priority";
import { Actions } from "../actions";
// ng-bootstrap modal
import { NgbActiveModal, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormControl } from "@angular/forms/";
import { BookService } from "../services/book.service";
import { BookStatus } from "../models/book-status";
import { EmailNotification } from "../models/emailNotification";
import { IDateModel, ITimeModel } from "../interfaces/idatetimemodel.interfaces";
import { EmailSendingService } from "../services/email-sending.service";

@Component({
  selector: 'app-add-book-form',
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.scss']
})
export class AddBookFormComponent implements OnInit {  
  modalTitle: string;
  isEditMode: boolean;
  editedBook: IBook;
  model: IBook;   
  @select((s:IAppState) => s.categories) categories$;
  @select((s:IAppState) => s.editedBook) editedBook$;
  date: IDateModel;
  time: ITimeModel = {hour: 0, minute: 0, second: 0};
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

  constructor(
    private ngRedux: NgRedux<IAppState>,    
    public activeModal: NgbActiveModal,
    private bookService: BookService,
    private emailService: EmailSendingService,
    config: NgbDatepickerConfig
  ) { 
    // customize default values of datepickers used by this component tree
    config.minDate = {year: 1900, month: 1, day: 1};
    config.maxDate = {year: 2099, month: 12, day: 31};

    // days that don't belong to current month are not visible
    config.outsideDays = 'hidden';

    // weekends are disabled
    config.markDisabled = (date: NgbDateStruct) => {
      const d = new Date(date.year, date.month - 1, date.day);
      var currentDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()  
      );   
      return currentDate.getTime() > d.getTime();
    };
  }

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
    if(this.model.sendNotification && this.date !== null) {
      // here convert datettime to UTC format and send data to our API
      this.model.notificationDateTime = this.convertDateTimeToUTC(this.date, this.time);
      this.addEmailNotification();
    }

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
  
  addEmailNotification() {
    let notification = new EmailNotification('alexa12lk@yandex.ru', 'someuid', 'aleks', this.model.title, this.model.author, this.model.notificationDateTime);
    this.emailService.addNotification(notification);
  }


  convertDateTimeToUTC(date: IDateModel, time: ITimeModel): Date {
    let newDate = new Date(date.year, date.month-1, date.day, time.hour, time.minute, time.second);
    // let utcNewDate = new Date(
    //   newDate.getUTCFullYear(), 
    //   newDate.getUTCMonth(), 
    //   newDate.getUTCDate(), 
    //   newDate.getUTCHours(), 
    //   newDate.getUTCMinutes(),
    //   newDate.getUTCSeconds());

    // our api converts to utc automatically. That's why let's send local datetime  
    return newDate;
  }

  // ctrl = new FormControl('', (control: FormControl) => {
  //   const value = control.value;

  //   if (!value) {
  //     return null;
  //   }

  //   if (value.hour < 12) {
  //     return {tooEarly: true};
  //   }
  //   if (value.hour > 13) {
  //     return {tooLate: true};
  //   }

  //   return null;
  // });

}


