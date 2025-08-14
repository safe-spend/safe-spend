export class Email {
    fromAddresses: string[];
    subject: string;
    body: EmailBody;
    attachments: EmailAttachment[];

    constructor(data: {
        fromAddresses: string[];
        subject: string;
        contentType: EmailContentType;
        body: string;
        attachments: {
            fileName: string;
            contentType: string;
            content: () => Promise<string>;
        }[];
    }) {
        this.fromAddresses = data.fromAddresses;
        this.subject = data.subject;
        this.body = new EmailBody({
            contentType: data.contentType,
            content: data.body,
        });
        this.attachments = data.attachments.map(
            (attachment) =>
                new EmailAttachment({
                    fileName: attachment.fileName,
                    contentType: attachment.contentType,
                    loadContent: attachment.content,
                })
        );
    }
}

export class EmailBody {
    contentType: EmailContentType;
    content: string;

    constructor(data: { contentType: EmailContentType; content: string }) {
        this.contentType = data.contentType;
        this.content = data.content;
    }

    textContent = (): string =>
        this.contentType === EmailContentType.Text ? this.content : this.content.replace(/<[^>]*>/gm, '');
}

export class EmailAttachment {
    fileName: string;
    contentType: string;
    loadContent: () => Promise<string>;

    constructor(data: { fileName: string; contentType: string; loadContent: () => Promise<string> }) {
        this.fileName = data.fileName;
        this.contentType = data.contentType;
        this.loadContent = data.loadContent;
    }
}

export enum EmailContentType {
    Text = "text",
    Html = "html",
}