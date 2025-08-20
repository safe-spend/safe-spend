import { HdfcBank } from '../../adapters/import/banks/HdfcBank';
import { Account } from '../../db/entities/Account';
import { FeatureName } from '../../db/entities/FeatureName';
import { IEmailAccessService } from '../../provider-matrix/IEmailAccessService';
import { PM } from '../../provider-matrix/ProviderMatrix';

export async function sync(account: Account) {
    const emailId = 'AQMkADAwATYwMAItZTMxYy0xMQAwMS0wMAItMDAKAEYAAANBr2FgQ8c5SKspgzulX130BwDOMLxKyHO7TKS9PePOEoOsAAgtJ9TIAAAAzjC8Sshzu0ykvT3jzhKDrAAI_nIaaAAAAA==';
    // const accessToken = await AccountManager.getInstance().getAccessToken(account);
    // const res = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${emailId}`, {
    //     headers: {
    //         'Authorization': `Bearer ${accessToken}`
    //     }
    // }).then(res => res.json())

    // const fetchAttachments = async (): Promise<EmailAttachment[]> => {
    //     const attachRes = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${emailId}/attachments`, {
    //         headers: {
    //             'Authorization': `Bearer ${accessToken}`
    //         }
    //     }).then(res => res.json());

    //     return attachRes.value.map((attachment: any) => ({
    //         fileName: attachment.name,
    //         contentType: attachment.contentType,
    //         content: async () => {
    //             return Promise.resolve(attachment.contentBytes as string);
    //         }
    //     }));
    // }


    // const emailData = new Email({
    //     fromAddresses: [res.from?.emailAddress?.address].filter(Boolean),
    //     subject: res.subject,
    //     contentType: res.body?.contentType === 'html' ? EmailContentType.Html : EmailContentType.Text,
    //     body: res.body?.content || '',
    //     attachments: {
    //         getCount: () => Promise.resolve(res.hasAttachments ? 1 : 0),
    //         fetchAttachments,
    //     },
    // });

    const emailService = PM().get(account.providerName, FeatureName.EmailAccess) as IEmailAccessService | undefined;
    if (!emailService) {
        throw new Error("Email access service not found");
    }

    const email = await emailService.fetchEmail(account, emailId);

    const adapter = new HdfcBank();
    const transactions = await adapter.readTransactionsFromEmail(email);
    console.log(transactions);
}