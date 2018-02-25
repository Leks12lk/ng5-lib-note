import { Injectable } from '@angular/core';
import { EmailNotification } from "../models/emailNotification";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";

@Injectable()
export class EmailSendingService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  }

  addNotification(notification: EmailNotification) {
    let url = environment.libNoteApiUrl;
    return this.http.post(url, notification, this.httpOptions)
      .subscribe(user => console.log('done'));
  }

  updateNotification(notification: EmailNotification) {
    let url = environment.libNoteApiUrl;
    return this.http.put(url, notification, this.httpOptions)
      .subscribe(user => console.log('done'));
  }

  deleteNotification(bookKey: string, userUid: string) {   
    if(!bookKey || !userUid) return;
    let url = environment.libNoteApiUrl + `?bookKey=${bookKey}&userUid=${userUid}`;
    return this.http.delete(url, this.httpOptions)
      .subscribe(user => console.log('done'));
  }

}
