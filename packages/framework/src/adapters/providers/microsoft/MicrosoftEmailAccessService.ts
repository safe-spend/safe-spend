import { Account } from "../../../db/entities/Account";
import { FeatureName } from "../../../db/entities/Token";
import { IEmailAccessService } from "../../../provider-matrix/IEmailAccessService";
import { Email, EmailAttachment, EmailContentType } from "../../../provider-matrix/types/Email";
import { MicrosoftProvider } from "./MicrosoftProvider";

interface EmailResponse {
  from: { emailAddress: { address: string } };
  subject: string;
  body: { content: string; contentType: string };
  hasAttachments: boolean;
}

interface EmailAttachmentResponse {
    name: string;
    contentType: string;
    contentBytes: string;
}

export class MicrosoftEmailAccessService extends MicrosoftProvider implements IEmailAccessService {
  featureName = FeatureName.EmailAccess;
  scopes = 'offline_access User.Read Mail.Read';

  async fetchEmail(account: Account, id: string): Promise<Email> {
    const emailResponse = await this.fetchEmailResponse(account, id);

    const fetchAttachments = async (): Promise<EmailAttachment[]> => {
      const attachmentResponse = await this.fetchEmailAttachments(account, id);
      return attachmentResponse.map(attachment => new EmailAttachment({
        fileName: attachment.name,
        contentType: attachment.contentType,
        loadContent: async () => {
          return Promise.resolve(attachment.contentBytes);
        }
      }));
    }

    return new Email({
      fromAddresses: [emailResponse.from.emailAddress.address],
      subject: emailResponse.subject,
      contentType: emailResponse.body?.contentType === 'html' ? EmailContentType.Html : EmailContentType.Text,
      body: emailResponse.body.content,
      attachments: {
        getCount: () => Promise.resolve(emailResponse.hasAttachments ? 1 : 0),
        fetchAttachments,
      },
    });
  }

  private async fetchEmailResponse(account: Account, id: string): Promise<EmailResponse> {
    const accessToken = await this.getAccessToken(account);

    const response = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch email");
    }

    return await response.json();
  }

  private async fetchEmailAttachments(account: Account, id: string): Promise<EmailAttachmentResponse[]> {
    const accessToken = await this.getAccessToken(account);

    const response = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${id}/attachments`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch email attachments");
    }

    const res = await response.json();
    return res.value;
  }

}