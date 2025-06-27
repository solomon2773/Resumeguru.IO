let NewsletterSubscribeBuffer = '';

switch(process.env.BACKEND_PROVIDER) {

    case 'MongoDB':
        switch(process.env.BACKEND_VERSION) {

            case '2023-01':
                NewsletterSubscribeBuffer = `
                mutation newsletterSubscribe($data: NewsletterInsertInput!){
                      insertOneNewsletter(data: $data){
                        _id
                      }
                    }
                         
                  
                `;
                break;
            default:
                NewsletterSubscribeBuffer = '';
        }
        break;
    default:
        NewsletterSubscribeBuffer = '';
}

export const NewsletterSubscribe = NewsletterSubscribeBuffer
