// Example: User Registration Event Tracking
export async function handleUserRegistration(userData){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'user_registration',
        dlv_userId: userData.userId,
        dlv_registrationFrom: userData.registrationFrom,
    });

};





