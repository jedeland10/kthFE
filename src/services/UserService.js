import {useCookies} from "react-cookie";
import TokenApi from "../api/TokenApi";
import jwt_decode from "jwt-decode";

function UserService() {
    const [cookies, setCookie] = useCookies(['user'])

    const tokenApi = TokenApi()

    function getUserCookie() {
        let end;
        const dc = document.cookie;
        const prefix = 'user=';
        let begin = dc.indexOf("; " + prefix);
        if (begin === -1) {
            begin = dc.indexOf(prefix);
            if (begin !== 0) return null;
        }
        else
        {
            begin += 2;
            end = document.cookie.indexOf(";", begin);
            if (end === -1) {
                end = dc.length;
            }
        }
        return decodeURI(dc.substring(begin + prefix.length, end));
    }

    return {
        loginUser: (user) => {
            tokenApi.getToken(user)
                .then(response => {
                    if (response === null) return

                    const token = response.jwtToken
                    if (token === null) return

                    const decodedToken = JSON.parse(jwt_decode(token).sub)
                    setCookie('user',{
                        token: token,
                        username: decodedToken.username,
                        userId: decodedToken.id,
                        firstName: decodedToken.firstName,
                        lastName: decodedToken.lastName,
                        loggedIn: true
                    })

                })
        },

        logout: () => {
            setCookie('user', null)
        },
        getUsername: () => {
            if(getUserCookie() !== null) return cookies.user.username
        },
        getFirstName: () => {
            if(getUserCookie() !== null) return cookies.user.firstName
        },
        getToken: () => {
            if(getUserCookie() !== null) return cookies.user.token
            else return null
        },
        getUserId: () => {
            if(getUserCookie() !== null) return cookies.user.userId
        },
        isLoggedIn: () => {
            if(getUserCookie() !== null) return cookies.user.loggedIn
            else return false
        }
    }
}

export default UserService
