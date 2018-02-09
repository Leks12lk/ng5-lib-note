
import { Book } from "../models/book";
import { Priority } from "../models/priority";

export const Books: Book[] = [
    new Book(1,'Test Book', 'Test author', 'Professional', Priority.Low),
    new Book(2,'Test Book 1', 'Test author 1', 'Cooking', Priority.Medium),
    new Book(3,'Test Book 2', 'Test author 2', 'Professional', Priority.High)
];