import { Priority } from "../models/priority";

export interface IBook {
    //id: string,
    $key?: string,
    title: string,
    author: string,
    category: string,
    priority: Priority,
    isRead: boolean,
    sendNotification: boolean
}