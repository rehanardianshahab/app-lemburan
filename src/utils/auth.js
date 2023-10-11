export default {
    getCookies(cookie){
        const kukiss = document.cookie.split('; ')
        return kukiss.find(data => data.search(cookie + '=/')).split(cookie + '=')[1]
    },
    deleteCookies(){
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
}
