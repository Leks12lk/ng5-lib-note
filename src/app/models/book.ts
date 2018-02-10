import { IBook } from "../interfaces/ibook.interface";
import { Priority } from "./priority";

export class Book implements IBook {
    //id: number;
    isRead: boolean = false;
    sendNotification: boolean = false;    

    constructor(
        public id: number,
        public title:string,
        public author: string,
        public category: string,
        public priority: Priority
    ) {
       
    }

}