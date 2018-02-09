import { Component, OnInit } from '@angular/core';
import { NgRedux } from "@angular-redux/store";
import { IAppState } from "../store";
import { IBook } from "../interfaces/ibook.interface";
import { Priority } from "../models/priority";
import { Actions } from "../actions";
// ng-bootstrap modal
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from "@angular/forms/";

@Component({
  selector: 'app-add-book-form',
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.scss']
})
export class AddBookFormComponent implements OnInit {
  closeResult: string;
  modalRef: any;

  date: any;
  time = {hour: 0, minute: 0};

  model: IBook = {
    id: 0,
    title: '',
    author: '',
    category: '',
    priority: Priority.Low,
    isRead: false,
    sendNotification: false
  }

  constructor(private ngRedux: NgRedux<IAppState>, private modalService: NgbModal) { }

  ngOnInit() {
  }

  addBook(addBookForm : NgForm) {
    this.ngRedux.dispatch({type: Actions.ADD_BOOK, book: this.model});
    // reset the form values
    addBookForm.reset();
    // close the modal
    this.modalRef.close();
  }


  open(content) {
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
