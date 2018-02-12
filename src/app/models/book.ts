import { IBook } from "../interfaces/ibook.interface";
import { Priority } from "./priority";
import { BookStatus } from "./book-status";

export class Book implements IBook {   
    $key?: string;
    isRead: boolean = false;
    sendNotification: boolean = false;
    status: BookStatus = BookStatus.ToRead;

    constructor(
        public title:string,
        public author: string,
        public category: string,  
        public priority: Priority,
        public notes: string
    ) {
       
    }

}