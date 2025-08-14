import { AccountManager } from '../../auth/core/AccountManager';
import { UserAccount } from '../../db/entities/UserAccount';
import { Utils } from '../../utils/utils';
import { HdfcBank } from '../adapters/banks/HdfcBank';
import { Email, EmailContentType } from '../adapters/types/Email';

export async function sync(account: UserAccount) {
    const emailId = 'AQMkADAwATYwMAItZTMxYy0xMQAwMS0wMAItMDAKAEYAAANBr2FgQ8c5SKspgzulX130BwDOMLxKyHO7TKS9PePOEoOsAAgtJ9TIAAAAzjC8Sshzu0ykvT3jzhKDrAAI_nIaaAAAAA==';
    const accessToken = await AccountManager.getInstance().getAccessToken(account);
    const res = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${emailId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res => res.json())

    var attachments: { fileName: string; contentType: string; content: () => Promise<string> }[] = [];

    if (res.hasAttachments) {

        const attachRes = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${emailId}/attachments`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => res.json());

        attachments = attachRes.value.map((attachment: any) => ({
            fileName: attachment.name,
            contentType: attachment.contentType,
            content: async () => {
                // Convert base64 to ArrayBuffer
                return Promise.resolve(attachment.contentBytes as string);
            }
        }));
    }


    const emailData = new Email({
        fromAddresses: [res.from?.emailAddress?.address].filter(Boolean),
        subject: res.subject,
        contentType: res.body?.contentType === 'html' ? EmailContentType.Html : EmailContentType.Text,
        body: res.body?.content || '',
        attachments: attachments, // You can map attachments here if present in res
    });

    const adapter = new HdfcBank();
    const transactions = await adapter.readTransactionsFromEmail(emailData);
    console.log(transactions);
}