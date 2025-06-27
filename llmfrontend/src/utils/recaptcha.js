export const executeRecaptcha = (action) => {
    return new Promise((resolve) => {
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.ready(() => {
                grecaptcha.execute(process.env.RECAPTCHA_SITE_KEY, { action }).then((token) => {
                    resolve(token);
                });
            });
        } else {
            resolve(null);
        }
    });
};
