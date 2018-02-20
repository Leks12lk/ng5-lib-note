import { Injectable } from '@angular/core';
import { IUser } from "../interfaces/iuser.interface";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import { NgRedux } from "@angular-redux/store";
import { IAppState } from "../store";
import { AngularFireAuth } from "angularfire2/auth";
import { AuthService } from "./auth.service";
import { Actions } from "../actions";

@Injectable()
export class UserService {
  userId: string;
  user: IUser;

  userRef: any;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private ngRedux: NgRedux<IAppState>,
    private authService: AuthService
  ) {      
      this.afAuth.authState.subscribe(user => {
        if(user) {
          this.userId = user.uid;
          this.userRef = db.object(`users/${this.userId}`);

          this.userRef.valueChanges().subscribe((u: IUser) => {
            if(u) {
              this.user = u;
              this.ngRedux.dispatch({type: Actions.LOAD_USER, user: this.user});
              this.ngRedux.dispatch({type: Actions.LOAD_CATEGORIES, categories: this.user.categories});              
            }
          });
          
        }
      }); 
     
    }  

  addCategory(cat: string)  {
    if (!this.userId) return;
    this.user.categories.push(cat);
    this.userRef.update(this.user)
        .catch(error => console.log(error));

    this.ngRedux.dispatch({type: Actions.ADD_BOOK, category: cat});
  }

}
