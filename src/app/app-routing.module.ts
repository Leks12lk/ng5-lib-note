import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterFormComponent } from "./register-form/register-form.component";
import { LoginFormComponent } from "./login-form/login-form.component";
import { BooksListComponent } from "./books-list/books-list.component";

const routes: Routes = [
  // { path: 'register', component: RegisterFormComponent },
  // { path: 'login', component: LoginFormComponent },
  // { path: 'books', component: BooksListComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
