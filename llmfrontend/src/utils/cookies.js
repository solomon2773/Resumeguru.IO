export async function setCookie(cname, cvalue, expdays) {
    const d = new Date();
    d.setTime(d.getTime() + (expdays * 24 * 60 * 60 * 1000)); // 24 hours * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second
    let expires = "expires="+d.toUTCString();

    if (process.env.DEV){
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    } else  {
        document.cookie = `${cname}=${cvalue}; ${expires}; path=/; domain=resumeguru.io; Secure; SameSite=None`;
    }

}

export  async function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return false;
}
function checkCookie(cname) {
    let username = getCookie(cname);
    if (username != "") {
        // alert("Welcome again " + username);
    } else {
        username = prompt("Please enter your name:", "");
        if (username != "" && username != null) {
            // setCookie("username", username, 365);
        }
    }
}
export async function removeCookie(cname) {
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=resumeguru.io; Secure; SameSite=None`;
}
