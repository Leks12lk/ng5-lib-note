export class EmailNotification {
    constructor(
        public email: string,
        public userUid: string,
        public userName: string,
        public bookTitle: string,
        public bookAuthor: string,
        public dateTimeToSendEmail: Date
    ) {}
}