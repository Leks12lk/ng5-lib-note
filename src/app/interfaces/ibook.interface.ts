import { Priority } from "../models/priority";
import { BookStatus } from "../models/book-status";

export interface IBook {
    key?: string,
    title: string,
    author: string,
    categories: string[],
    priority: Priority,
    isRead: boolean,
    sendNotification: boolean,
    status: BookStatus,
    notes: string,
    notificationDateTime?: Date
}
