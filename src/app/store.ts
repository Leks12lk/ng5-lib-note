import { IUser } from "./interfaces/iuser.interface";
import { IBook } from "./interfaces/ibook.interface";
//import { Books } from "./mockdata/books";
import { Actions } from "./actions";
import { tassign } from 'tassign';
import {Priority} from './models/priority';

export interface IAppState {
	user: IUser,
	books: IBook[],
	categoriesTags: string[],
	lastUpdate: Date,
  filteredBooks: IBook[]

}

export const INITIAL_STATE: IAppState = {
	user: null,
	books: [],
	categoriesTags: [],
	lastUpdate: new Date(),
  filteredBooks: []
};

export function rootReducer(state, action) {
	switch(action.type) {
		case Actions.ADD_BOOK:
			action.book.id = state.books.length + 1;
			return tassign(state, {
				books: state.books.concat(tassign({},action.book)), lastUpdate: new Date()
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
			  books: action.selectTerm.length > 0 ? action.books.filter(book => book.priority === action.selectTerm) : action.books,
			});
    case Actions.SEARCH_BOOK:
      return tassign(state,{
        filteredBooks: action.term.length > 0 ? state.books.filter(item => item.title.search(action.term) !== -1 || item.author.search(action.term) !== -1) : []
      });
	}

	return state;
}


