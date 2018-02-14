import { IUser } from "./interfaces/iuser.interface";
import { IBook } from "./interfaces/ibook.interface";
//import { Books } from "./mockdata/books";
import { Actions } from "./actions";
import { tassign } from 'tassign';
import {Priority} from './models/priority';

export interface IAppState {
	user: IUser,
	books: IBook[],
	categories: string[],
	lastUpdate: Date,
  filteredBooks: IBook[]
}

export const INITIAL_STATE: IAppState = {
	user: null,
	books: [],
	categories: [],
	lastUpdate: new Date(),
  filteredBooks: []
};

export function rootReducer(state, action) {
	switch(action.type) {
		case Actions.ADD_BOOK:
			//action.book.id = state.books.length + 1;
			return tassign(state, {
				books: state.books.concat(tassign({},action.book)),
				lastUpdate: new Date()
			});
		case Actions.REMOVE_BOOK:
			return tassign(state, {
				books: state.books.filter(b => b.id !== action.id),
				lastUpdate: new Date()
			});
		case Actions.TOGGLE_READ_STATUS:
			var book = state.books.find(b => b.id === action.id);
			var index = state.books.indexOf(book);
			return tassign(state, {
				books: [
					...state.books.slice(0, index),
					tassign(book, {isRead: !book.isRead}),
					...state.books.slice(index+1)
				],
				lastUpdated: new Date()
			});
		case Actions.TOGGLE_SEND_NOTIFICATION:
			var book = state.books.find(b => b.id === action.id);
			var index = state.books.indexOf(book);
			return tassign(state, {
				books: [
					...state.books.slice(0, index),
					tassign(book, {sendNotification: !book.sendNotification}),
					...state.books.slice(index+1)
				],
				lastUpdated: new Date()
			});
		case Actions.LOAD_BOOKS:
			return tassign(state, {
			  	books: action.books,
				filteredBooks: action.books
			});
		case Actions.SEARCH_BOOK:
			return tassign(state,{
						filteredBooks: filterBooks(action, state),
						lastUpdated: new Date()
			});

		case Actions.LOAD_CATEGORIES:
			return tassign(state, {
				categories: action.categories
			});
		case Actions.ADD_CATEGORY:
			return tassign(state, {
				categories: state.categories.concat(tassign({},action.category)),
				lastUpdate: new Date()
			});

	}

	return state;
}


function filterBooks(action, state) {
  function compareArray(arr1: string[], arr2: string[]) {
    let resultArray: boolean[] = [];
    for(let i = 0; i < arr1.length; i ++) {
      let itemResult:boolean = arr2.indexOf(arr1[i]) !== -1;
      resultArray.push(itemResult);
    }
    return resultArray.indexOf(true) !== -1
  }
	let priorityFilteredBooks = action.searchTerms.priorityTerm.length > 0
		? state.books.filter(book => book.priority === action.searchTerms.priorityTerm)
		: state.books;

  let textFilteredBooks = action.searchTerms.textTerm.length > 0
		? priorityFilteredBooks.filter(
				item => item.title.toLowerCase().search(action.searchTerms.textTerm.toLowerCase()) !== -1
				|| item.author.toLowerCase().search(action.searchTerms.textTerm.toLowerCase()) !== -1
		)
		: priorityFilteredBooks;
  let categoryFilteredBooks = action.searchTerms.categoryTerm.length > 0
    ? textFilteredBooks.filter(book => compareArray(book.category, action.searchTerms.categoryTerm))
    : textFilteredBooks;

  return categoryFilteredBooks;
}


