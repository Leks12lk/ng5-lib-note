import { IBook } from "../interfaces/ibook.interface";
import { Priority } from "./priority";

export class Book implements IBook {
    //id: number;
    isRead: boolean;
    sendNotification: boolean;

    constructor(
        public id: number,
        public title:string,
        public author: string,
        public category: string,
        public priority: Priority
    ) {
        this.isRead = false;
        this.sendNotification = false;
    }

}