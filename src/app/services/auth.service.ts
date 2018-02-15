import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/observable';

@Injectable()
export class AuthService { 
	private user: Observable<firebase.User>;
	private authState: any;

	constructor(private afAuth: AngularFireAuth, 
		private db: AngularFireDatabase, 
		private router: Router) {
			this.user = this.afAuth.authState;
		 }

	get currentUserId() : string {
		return this.authState !== null ? this.authState.uid : '';
	}

	authUser() {
		return this.user;
	}

	login(email: string, password: string) {
		return this.afAuth.auth.signInWithEmailAndPassword(email, password)
			.then(resolve => {
				// here will be navigate to books list page
				this.router.navigate(['books']);
			})
	}

	logout() {
		this.afAuth.auth.signOut();
		this.router.navigate(['login']);
	  }

	register(email: string, password: string, userName: string) {
		return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
			.then(user => {
				this.authState = user;
				console.log(this.authState);
				this.setUserData(email, userName);
			}).catch(error => {
				console.log(error);
			})
	}

	setUserData(email: string, userName: string) {		
		let path = `users/${this.currentUserId}`;
		let data = {
			email,
      		userName
    	}
		
		this.db.object(path).update(data)
			.catch(error => console.log(error));
	}
	

	// getAuthUser() {
	// 	return this.user;
	// }


}
