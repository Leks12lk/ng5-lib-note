import { IBook } from "../interfaces/ibook.interface";
import { Priority } from "./priority";

export class Book implements IBook {
    //id: string;
    $key?: string;
    isRead: boolean = false;
    sendNotification: boolean = false;

    constructor(        
        public title:string,
        public author: string,
        public category: string,  
        public priority: Priority
    ) {
       
    }

}