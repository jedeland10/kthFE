import React from "react";
import {useNavigate} from "react-router-dom";
import LoginForm from "./LoginForm";
import UserService from "../../services/UserService";


function LoginUser() {
    const userService = UserService()

    const navigate = useNavigate();

    const onSubmit = async (user) => {
        await userService.loginUser(user)

        navigate('/')
    }


    return(
        <div>
            <h2>Login</h2>
            <LoginForm submitText="Login" submitAction={onSubmit} />
        </div>
    )
}
export default LoginUser
