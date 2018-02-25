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
import { UserService } from "../services/user.service";
import { IUser } from "../interfaces/iuser.interface";

@Component({
  selector: 'app-add-book-form',
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.scss']
})
export class AddBookFormComponent implements OnInit {  
  modalTitle: string;
  isEditMode: boolean;
  editedBook: IBook;
  // keeps properties values of book before editing
  prevBookState: IBook = null;
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
    sendNotification: false,
    status: BookStatus.ToRead,
    notes: ''
  };

  userEmail: string;
  userUid: string;
  userName: string;

  @select((s:IAppState) => s.user) user$;

  constructor(
    private ngRedux: NgRedux<IAppState>,    
    public activeModal: NgbActiveModal,
    private bookService: BookService,
    private emailService: EmailSendingService,
    private userService: UserService,
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
        this.prevBookState = editedBook;
        this.isEditMode = true;
        this.date = this.buildDate(this.model.notificationDateTime);
        this.time = this.buildTime(this.model.notificationDateTime);
      } else { // adding new book
        this.model = this.newBook;
        this.modalTitle = "Add New Book";
        this.isEditMode = false;
      }      
    });

    this.user$.subscribe((user: IUser) => {
      this.userEmail = user.email;
      this.userName = user.userName;
      this.userUid = user.userId;
    });
  }

  addBook(addBookForm : NgForm) {  
    let bookKey: string = '';
    if(this.isEditMode) {
      // in order to save the same object
      this.editedBook = Object.assign({}, this.model);
      this.bookService.updateBook(this.editedBook);
      bookKey = this.editedBook.key;
    } else {
      bookKey = this.bookService.addBook(this.model);      
    }

    if(this.model.sendNotification && this.date !== null) {
      // here convert datettime to UTC format and send data to our API
      this.model.notificationDateTime = this.convertDateTimeToUTC(this.date, this.time);

      if(this.isEditMode) {      
        this.addUpdateEmailNotification(bookKey, true);
      } else {
        this.addUpdateEmailNotification(bookKey);
      }
      
    } else {
      // if send notification was true but now is false - delete it from our DB
      if(this.prevBookState.sendNotification) {
        this.emailService.deleteNotification(bookKey, this.userUid);
      }
    }


    // reset the form values
    addBookForm.reset();
    // close the modal
    this.activeModal.close('Close click');
    // remove edited book from state
    this.ngRedux.dispatch({type: Actions.REMOVE_EDITED_BOOK});   
  }

  addBookCategory(categoryName: string) {
    if(!categoryName) return;
    this.model.categories = this.model.categories !== undefined ? this.model.categories : [];
    this.model.categories.indexOf(categoryName) === -1 ? this.model.categories.push(categoryName) : null;
  }

  removeBookCategory(categoryName: string) {
    const categoriesArray = this.model.categories;
    categoriesArray.splice(categoriesArray.indexOf(categoryName), 1);
  }


  closeModal() {
    this.ngRedux.dispatch({type: Actions.REMOVE_EDITED_BOOK});
    this.activeModal.close('Close click');
  }
  
  private addUpdateEmailNotification(bookKey: string, isUpdate: boolean = false) {
    if(bookKey && this.userEmail && this.userName && this.userUid) {
      let notification = new EmailNotification(
        this.userEmail, 
        this.userUid, 
        this.userName, 
        bookKey, 
        this.model.title, 
        this.model.author, 
        this.model.notificationDateTime
      );

      // if edit mode - update notification
      if(isUpdate) {
        this.emailService.updateNotification(notification);
      } else {
        this.emailService.addNotification(notification);
      }
      
    }
  }


  private convertDateTimeToUTC(date: IDateModel, time: ITimeModel): Date {
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

  private buildDate(dateTime: Date): IDateModel {
    dateTime = new Date(dateTime);   
    let date = {
      year: dateTime.getFullYear(),
      month: dateTime.getMonth() + 1,
      day: dateTime.getDate(),      
    };
     return date;
  }

  private buildTime(dateTime: Date): ITimeModel {
    dateTime = new Date(dateTime);
    let time = {
      hour: dateTime.getHours(),
      minute: dateTime.getMinutes(),
      second: 0
    };
    return time;
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


