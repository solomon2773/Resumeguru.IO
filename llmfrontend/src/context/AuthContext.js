import React, { useContext, useState, useEffect, useRef } from 'react'
import {setCookie, removeCookie, getCookie} from "../utils/cookies";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,  signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, GithubAuthProvider, OAuthProvider } from 'firebase/auth'
import { auth, db } from '../helpers/firebase/firebase'
import {useClientDetails} from "../hooks/referrallink/useClientDetails";
import countryList ,{ countryListSearch }from "../utils/staticObjects/countryList";

const AuthContext = React.createContext()
import { useRouter } from 'next/router';
import {useDispatch} from "react-redux";
import {setUserBasicProfile } from "../store/userReducer";
import {mongodbAddingPromoInvoice} from "../helpers/mongodb/admin/invoices/invoices";
import {
    mongoDBinsertOneUserStatus,
    mongoDBFindExistingUserByFirebaseId,
    mongoDBAddNewUser,
    mongoDBFindUserAndUpdateByUserId,
    mongoDBFindExistingUserByUserId,

} from "../helpers/mongodb/context/authContext";





export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)

    const [clientIpAddress, clientDetails] = useClientDetails();
    const globalCookieName = 'rg_user_logout_2';
    const router = useRouter();

    async function hashString(string, salt) {
        const encoder = new TextEncoder();
        const data = encoder.encode(string + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => ('0' + byte.toString(16)).slice(-2)).join('');
        return hashHex;
    }
    async function signupEmailLink(email) {
        console.log(email)
        // const auth = getAuth();
        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: process.env.SITE_URL+"/login?email="+email+"&mode=signIn",
            // This must be true.
            handleCodeInApp: true,
            // iOS: {
            //     bundleId: 'com.example.ios'
            // },
            // android: {
            //     packageName: 'com.example.android',
            //     installApp: true,
            //     minimumVersion: '12'
            // },
            // dynamicLinkDomain: 'example.page.link'
        };
        // await sendSignInLinkToEmail(auth, email, actionCodeSettings)
        //     .then(async () => {
        //         // The link was successfully sent. Inform the user.
        //         // Save the email locally so you don't need to ask the user for it again
        //         // if they open the link on the same device.
        //         window.localStorage.setItem('emailForSignIn', email);
        //         return  true  ;
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //         const errorCode = error.code;
        //         const errorMessage = error.message;
        //         return false;
        //     });
    }
    async function login(email, password) {

        const result = await signInWithEmailAndPassword(auth, email, password);
        const firebaseLogin = result.user;

        if (firebaseLogin.uid){
            // Get the Firebase ID Token (similar to accessToken)
            const accessToken = await firebaseLogin.getIdToken();
            const firebaseProviderData = firebaseLogin.providerData;
            await userStatusInsert('loginWithGithub',firebaseLogin.uid);
            const currentDate = Date.now(); // Get current date in Unix timestamp
            const result = await getCookie(globalCookieName);
            if (!result) {
                await setCookie(globalCookieName, JSON.stringify({ logoutDate: currentDate }), 30);
            }
            // console.log(firebaseProviderData)
            const newUserData = {
                firebaseID:firebaseLogin.uid,
                userId: firebaseLogin.uid,
                email: firebaseLogin.email,
                about:"",
                city:clientDetails.city,
                region:clientDetails.region,
                country:clientDetails.country ? await countryListSearch(clientDetails.country) : countryList[0],

                createdAt: new Date(),
                signupId: "email",
                providerId: firebaseProviderData[0] && firebaseProviderData[0].providerId,
                providerUId: firebaseProviderData[0] && firebaseProviderData[0].uid,
                displayName: firebaseProviderData[0] && firebaseProviderData[0].displayName,
                firstName: firebaseProviderData[0] && firebaseProviderData[0].displayName ? firebaseProviderData[0].displayName.split(' ')[0] :  "Email",
                lastName: firebaseProviderData[0] && firebaseProviderData[0].displayName ? firebaseProviderData[0].displayName.split(' ')[1] :  "Email",
                newFirebaseOnlyLogin: true,
            }
            const userData = await updateUserData(newUserData);
            // subscribeNewsLetter(firebaseLogin.email);
            // const currentUserData = reloadRealmUser().then((user)=>{
            //
            // });

            window.gtag('set', 'user_id', firebaseLogin.uid);
            window.gtag('event', 'login', { method: 'custom', timestamp: new Date().toLocaleString() });
            await setCookie('ka_u_token', accessToken, 30);
            await setCookie('ka_u_id', firebaseLogin.uid, 30);
            return userData.userId;
        }

    }
    async function emailPasswordSignUp(email, password, firstName, lastName) {

        const createNewUser = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseLogin = createNewUser.user; // Firebase User Object

    if (firebaseLogin.uid) {
        const accessToken = await firebaseLogin.getIdToken();
        const firebaseProviderData = auth.currentUser.providerData;
        await userStatusInsert('loginWithEmail', firebaseLogin.uid);
        const currentDate = Date.now(); // Get current date in Unix timestamp
        const result = await getCookie(globalCookieName);
        if (!result) {
            await setCookie(globalCookieName, JSON.stringify({logoutDate: currentDate}), 30);
        }

        const newUserProfile = {
            firebaseID: firebaseLogin.uid,
            userId: firebaseLogin.uid,
            email: firebaseLogin.email,
            about: "",
            city: clientDetails.city,
            region: clientDetails.region,
            country: clientDetails.country ? await countryListSearch(clientDetails.country) : countryList[0],

            createdAt: new Date(),
            signupId: "email",
            providerId: firebaseProviderData[0] && firebaseProviderData[0].providerId,
            providerUId: firebaseProviderData[0] && firebaseProviderData[0].uid,
            displayName: firstName + " " + lastName,
            firstName: firstName ? firstName : "Email",
            lastName: lastName ? lastName : "Email",
            newFirebaseOnlyLogin: true,
        };

        const userData = await updateUserData(newUserProfile);
        //  }

        window.gtag('set', 'user_id', firebaseLogin.uid);
        window.gtag('event', 'login', {method: 'custom', timestamp: new Date().toLocaleString()});
        await setCookie('ka_u_token', accessToken, 30);
        await setCookie('ka_u_id', firebaseLogin.uid, 30);
        return userData.userId;
    }

    }
    // function subscribeNewsLetter(email) {
    //     fetch(process.env.SITE_URL+"/api/blog/subscribe", {
    //         method: 'POST',
    //         body: JSON.stringify({email: email}),
    //         headers: {
    //             "Content-Type": 'application/json',
    //             "Authorization": `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
    //         }
    //     });
    // }
    async function userStatusInsert( statusType, userId ){
        const userStatusData ={
            userId: userId,
            clientIpAddress,
            city:clientDetails.city,
            region:clientDetails.region,
            country:clientDetails.country,
            countryCode:clientDetails.countryCode,
            path:router.asPath,
            statusType,
        };
        await mongoDBinsertOneUserStatus(userStatusData);

    }
    async function loginWithGoogle(signupId = null, promoInvoice = false) {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: "select_account", // Forces account selection
        });
        try{

        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const firebaseLogin = result.user;


        if (firebaseLogin.uid ){
            const firebaseProviderData = auth.currentUser.providerData;
            await userStatusInsert('loginWithGoogle',firebaseLogin.uid);
            const currentDate = Date.now(); // Get current date in Unix timestamp
            const result = await getCookie(globalCookieName);
            if (!result) {
                await setCookie(globalCookieName, JSON.stringify({ logoutDate: currentDate }), 30);
            }

          // if (!RealmLogin.email){
            const newUserData = {
                firebaseID:firebaseLogin.uid,
                userId: firebaseLogin.uid,
                email: firebaseLogin.email,
                about:"",
                city:clientDetails.city,
                region:clientDetails.region,
                country:clientDetails.country ? await countryListSearch(clientDetails.country) : countryList[0],

                createdAt: new Date(),
                signupId: signupId,
                providerId: firebaseProviderData[0] && firebaseProviderData[0].providerId,
                providerUId: firebaseProviderData[0] && firebaseProviderData[0].uid,
                displayName: firebaseProviderData[0] && firebaseProviderData[0].displayName,
                firstName: firebaseProviderData[0] && firebaseProviderData[0].displayName ? firebaseProviderData[0].displayName.split(' ')[0] :  "Google",
                lastName: firebaseProviderData[0] && firebaseProviderData[0].displayName ? firebaseProviderData[0].displayName.split(' ')[1] :  "Google",
                newFirebaseOnlyLogin: true,
            }
           // console.log(newUserData)
            const userData = await updateUserData(newUserData);
            // subscribeNewsLetter(firebaseLogin.email);
            if (promoInvoice){
                console.log('promoInvoice',promoInvoice)
                await mongodbAddingPromoInvoice(userData, signupId);
            }

         //  }
         //    const currentUserData = reloadRealmUser().then((user)=>{
         //       // console.log(user)
         //        //setCookie('rg_u_data', JSON.stringify(user), 30);
         //
         //    });
            window.gtag('set', 'user_id', firebaseLogin.uid);
            window.gtag('event', 'login', { method: 'custom', timestamp: new Date().toLocaleString() });
            await setCookie('ka_u_token', accessToken, 30);
            await setCookie('ka_u_id', firebaseLogin.uid, 30);
            return userData.userId;
        }
        } catch (error) {
            console.error("Error during Google login:", error.message);
            throw error; // Propagate error for higher-level handling
        }
    }
    async function loginWithMicrosoft(signupId = null, promoInvoice = false) {
        const provider = new OAuthProvider('microsoft.com');
        provider.setCustomParameters({
            tenant: process.env.MICROSOFT_APP_AUTH_TANANT_ID,
            prompt: "select_account", // Forces account selection
        });
        // provider.addScope('mail.read');
        // provider.addScope('calendars.read');
        const result = await signInWithPopup(auth, provider);
        const credential = OAuthProvider.credentialFromResult(result);

        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
        const firebaseLogin = result.user;
        const firebaseProviderData = auth.currentUser.providerData;

        const parts = firebaseLogin.email.split('#ext#');
        const firstPart = parts[0];

        const userEmail = firstPart.replace('_', '@');

        if (firebaseLogin.uid ){
            await userStatusInsert('loginWithMicrosoft',firebaseLogin.uid );
            const currentDate = Date.now(); // Get current date in Unix timestamp
            const result = await getCookie(globalCookieName);
            if (!result) {
                await setCookie(globalCookieName, JSON.stringify({ logoutDate: currentDate }), 30);
            }

            //  if (!RealmLogin.email){
            const newUserData = {
                firebaseID:firebaseLogin.uid,
                userId: firebaseLogin.uid,
                email: userEmail ? userEmail : firebaseLogin.email,
                about:"",
                city:clientDetails.city,
                region:clientDetails.region,
                country:clientDetails.country ? await countryListSearch(clientDetails.country) : countryList[0],

                createdAt: new Date(),
                signupId: signupId,
                providerId: firebaseProviderData[0] && firebaseProviderData[0].providerId,
                providerUId: firebaseProviderData[0] && firebaseProviderData[0].uid,
                displayName: firebaseProviderData[0] && firebaseProviderData[0].displayName,
                firstName: firebaseProviderData[0] && firebaseProviderData[0].displayName ? firebaseProviderData[0].displayName.split(' ')[0] :  "GitHub",
                lastName: firebaseProviderData[0] && firebaseProviderData[0].displayName ? firebaseProviderData[0].displayName.split(' ')[1] :  "GitHub",
                newFirebaseOnlyLogin: true,
            }

            // console.log(newUserData)
            const userData = await updateUserData(newUserData);
            // subscribeNewsLetter(firebaseLogin.email);

            //  }
            if (promoInvoice){
                await mongodbAddingPromoInvoice(userData, signupId);
            }

            window.gtag('set', 'user_id', firebaseLogin.uid);
            window.gtag('event', 'login', { method: 'custom', timestamp: new Date().toLocaleString() });
            await setCookie('ka_u_token', accessToken, 30);
            await setCookie('ka_u_id', firebaseLogin.uid, 30);
            return userData.userId;
        }
    }
    async function loginWithYahoo(signupId = null, promoInvoice = false) {
        const provider = new OAuthProvider('yahoo.com');
        // provider.addScope('mail-r');
        // provider.addScope('sdct-w');
        const result = await signInWithPopup(auth, provider);
        const credential = OAuthProvider.credentialFromResult(result);

        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
        const firebaseLogin = result.user;



        if (firebaseLogin.uid ){
            const firebaseProviderData = auth.currentUser.providerData;
           // await userStatusInsert('loginWithYahoo',firebaseLogin.uid);
            const currentDate = Date.now(); // Get current date in Unix timestamp
            const result = await getCookie(globalCookieName);
            if (!result) {
                await setCookie(globalCookieName, JSON.stringify({ logoutDate: currentDate }), 30);
            }

            //  if (!RealmLogin.email){
            const newUserData = {
                firebaseID:firebaseLogin.uid,
                userId: firebaseLogin.uid,
                email: firebaseLogin.email,
                about:"",
                city:clientDetails.city,
                region:clientDetails.region,
                country:clientDetails.country ? await countryListSearch(clientDetails.country) : countryList[0],

                createdAt: new Date(),
                signupId: signupId,
                providerId: firebaseProviderData[0] && firebaseProviderData[0].providerId,
                providerUId: firebaseProviderData[0] && firebaseProviderData[0].uid,
                displayName: firebaseProviderData[0] && firebaseProviderData[0].displayName,
                firstName: firebaseProviderData[0] && firebaseProviderData[0].displayName ? firebaseProviderData[0].displayName.split(' ')[0] :  "GitHub",
                lastName: firebaseProviderData[0] && firebaseProviderData[0].displayName ? firebaseProviderData[0].displayName.split(' ')[1] :  "GitHub",
                newFirebaseOnlyLogin: true,
            }

            // console.log(newUserData)
            const userData = await updateUserData(newUserData);
            // subscribeNewsLetter(firebaseLogin.email);

            //  }
            if (promoInvoice){
                console.log('promoInvoice',promoInvoice)
                await mongodbAddingPromoInvoice(userData, signupId);
            }

            window.gtag('set', 'user_id', firebaseLogin.uid);
            window.gtag('event', 'login', { method: 'custom', timestamp: new Date().toLocaleString() });
            await setCookie('ka_u_token', accessToken, 30);
            await setCookie('ka_u_id', firebaseLogin.uid, 30);
            return userData.userId;
        }
    }
    async function loginWithGithub(signupId = null, promoInvoice = false) {
        const provider = new GithubAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const credential = GithubAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const firebaseLogin = result.user;
        const firebaseProviderData = auth.currentUser.providerData;


        if (firebaseLogin.uid){
            await userStatusInsert('loginWithGithub',firebaseLogin.uid);
            const currentDate = Date.now(); // Get current date in Unix timestamp
            const result = await getCookie(globalCookieName);
            if (!result) {
                await setCookie(globalCookieName, JSON.stringify({ logoutDate: currentDate }), 30);
            }
            // console.log(firebaseProviderData)
                const newUserData = {
                    firebaseID:firebaseLogin.uid,
                    userId: firebaseLogin.uid,
                    email: firebaseLogin.email,
                    about:"",
                    city:clientDetails.city,
                    region:clientDetails.region,
                    country:clientDetails.country ? await countryListSearch(clientDetails.country) : countryList[0],

                    createdAt: new Date(),
                    signupId: signupId,
                    providerId: firebaseProviderData[0] && firebaseProviderData[0].providerId,
                    providerUId: firebaseProviderData[0] && firebaseProviderData[0].uid,
                    displayName: firebaseProviderData[0] && firebaseProviderData[0].displayName,
                    firstName: firebaseProviderData[0] && firebaseProviderData[0].displayName ? firebaseProviderData[0].displayName.split(' ')[0] :  "GitHub",
                    lastName: firebaseProviderData[0] && firebaseProviderData[0].displayName ? firebaseProviderData[0].displayName.split(' ')[1] :  "GitHub",
                    newFirebaseOnlyLogin: true,
                }
           const userData = await updateUserData(newUserData);
            // subscribeNewsLetter(firebaseLogin.email);
            // const currentUserData = reloadRealmUser().then((user)=>{
            //
            // });
            if (promoInvoice){
                await mongodbAddingPromoInvoice(userData, signupId);
            }

            window.gtag('set', 'user_id', firebaseLogin.uid);
            window.gtag('event', 'login', { method: 'custom', timestamp: new Date().toLocaleString() });
            await setCookie('ka_u_token', accessToken, 30);
            await setCookie('ka_u_id', firebaseLogin.uid, 30);
            return userData.userId;
        }
    }
    async function loginWithLinkedIn(signupId = null) {
        const provider = new OAuthProvider("oidc.linkedin-resumeguruio");
        // provider.addScope('openid.read');
        // provider.addScope('profile.read');
        // provider.addScope('email.read');
        console.log(provider)
        const result = await signInWithPopup(auth, provider).then(function(result) {
            // Handle successful authentication
        }).catch(function(error) {

            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
        });
        console.log(result)
        // const credential = OAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        const firebaseLogin = result.user;

        console.log(result)

    }
    async function logout() {

        await signOut(auth);

        await dispatch(setUserBasicProfile({}))
        await removeCookie('ka_u_id');
        await removeCookie('ka_u_token');
        await removeCookie('rg_u_data');
        window.gtag('set', 'user_id', "0");
        window.gtag('event', 'logout', { method: 'custom', timestamp: new Date().toLocaleString() });
        window.location.replace(process.env.SITE_URL);



    }
    async function sendNewUserWelcomeMail(submitData) {
        const emailData = {
            to: submitData.email,
            from: 'info@resumeguru.io',
            submitData,
        };

        await fetch('/api/mail/newUserWelcome', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.SKA_API_AUTH_TOKEN}`,
            },
            body: JSON.stringify(emailData),
        });





    }
    async function updateUserData(userData){
        const existingUser =  await mongoDBFindExistingUserByFirebaseId({firebaseID:userData.userId}).then((result) => {
            return result;
        })
            .catch((error) => {
                // Handle errors
                console.log(error)
                return error;
            });
        if (existingUser) {
            // User with the specified userId already exists, you can handle it here if needed
            await setCookie('rg_u_data', JSON.stringify(existingUser), 30);
            dispatch(setUserBasicProfile(existingUser));
            return existingUser;
        } else {
            // send our new user welcome email
            await sendNewUserWelcomeMail(userData)
            await setCookie('rg_u_data', JSON.stringify(userData), 30);
            dispatch(setUserBasicProfile(userData))
            // User with the specified userId does not exist, insert a new user

            return await mongoDBAddNewUser(userData).then((result) => {
                return result;
            })

        }

    }
    async function updateMergeUserData(userId, userData){
        await mongoDBFindUserAndUpdateByUserId({userId, userData})
        await mongoDBFindExistingUserByUserId({userId:userId}).then(async(result) => {
            if (result) {
                await setCookie('rg_u_data', JSON.stringify(result), 30);
                dispatch(setUserBasicProfile(result));
            }

        });


    }
    async function checkUserSession() {
        const currentDate = Date.now(); // Get current date in Unix timestamp
        const result = await getCookie(globalCookieName);

        if (!result) {
            // If the cookie doesn't exist, log out the user and set the cookie with the Unix timestamp
            await logout();
            await setCookie(globalCookieName, JSON.stringify({ logoutDate: currentDate }), 30);
            // console.log("Logged out and cookie set");
        }
        // else {
        //     // If the cookie exists, parse its value and compare dates in Unix timestamp
        //     const logoutData = JSON.parse(result);
        //     const lastLogoutDate = logoutData.logoutDate;
        //     const givenDate = new Date("2024-04-29T00:00:00").getTime(); // Convert to Unix timestamp
        //     // console.log("lastLogoutDate: " + lastLogoutDate);
        //     // console.log("givenDate: " + givenDate);
        //     if (lastLogoutDate < givenDate) {
        //         // If the last logout date is older than the given date, refresh the cookie
        //         await logout();
        //         await setCookie(cookieName, JSON.stringify({ logoutDate: currentDate }), 30);
        //         console.log("Cookie refreshed with new date");
        //     }
        // }
    }




    useEffect(() => {


        getCookie('rg_u_data').then((result) => {
           if (result && result !== 'undefined') {
               checkUserSession();
               //console.log(result);
               dispatch(setUserBasicProfile(JSON.parse(result)))


           } else {
               dispatch(setUserBasicProfile({}))
           }


       });

        setLoading(false)

    }, []);
    const [token, setToken] = useState(null);






    const value = {
        token,
        updateMergeUserData,
        login,
        loginWithGoogle,
        loginWithYahoo,
        loginWithMicrosoft,
        loginWithLinkedIn,
        loginWithGithub,
        emailPasswordSignUp,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            { children}
        </AuthContext.Provider>
    )
}


