export class Email {
    fromAddresses: string[];
    subject: string;
    body: EmailBody;
    attachments: EmailAttachments;

    constructor(data: {
        fromAddresses: string[];
        subject: string;
        contentType: EmailContentType;
        body: string;
        attachments: {
            getCount: () => Promise<number>;
            fetchAttachments: () => Promise<EmailAttachment[]>;
        };
    }) {
        this.fromAddresses = data.fromAddresses;
        this.subject = data.subject;
        this.body = new EmailBody({
            contentType: data.contentType,
            content: data.body,
        });
        this.attachments = new EmailAttachments({
            getCount: data.attachments.getCount,
            fetchAttachments: data.attachments.fetchAttachments,
        });
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

export class EmailAttachments {
    private _getCount: () => Promise<number>
    private _fetchAttachments: () => Promise<EmailAttachment[]>
    
    private _count: number | undefined;
    private _attachments: EmailAttachment[] | undefined

    constructor(data: { getCount: () => Promise<number>; fetchAttachments: () => Promise<EmailAttachment[]> }) {
        this._getCount = data.getCount;
        this._fetchAttachments = data.fetchAttachments;
    }

    hasAttachments = async (): Promise<boolean> => {
        return (await this.count()) > 0;
    }

    count = async (): Promise<number> => {
        if (this._count === undefined) {
            this._count = await this._getCount();
        }
        return this._count;
    }

    getAttachments = async (): Promise<EmailAttachment[]> => {
        if (this._count && this._count == 0) return []; 
        if (this._attachments === undefined) {
            this._attachments = await this._fetchAttachments();
        }
        return this._attachments;
    }
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