import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import UserService from "../../services/UserService";
import UserApi from "../../api/UserApi";

export default function RegisterUser() {
    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const navigate = useNavigate()

    const userApi = UserApi()
    const userService = UserService()

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password === confirm) {
            const newUser = {
                username: username,
                firstName: firstName,
                lastName: lastName,
                password: password
            }
            userApi.createUser(newUser).then(async createdUser => {
                await userService.loginUser({
                    username: createdUser.username,
                    password: password
                })
                navigate("/");
            })

        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username </label>
                    <input type="text" value={username} required onChange={(e) => setUsername(e.target.value)}/>
                </div>

                <div>
                    <label>First name</label>
                    <input type="text" value={firstName} required onChange={(e) => setFirstName(e.target.value)}/>
                </div>

                <div>
                    <label>Last name</label>
                    <input type="text" value={lastName} required onChange={(e) => setLastName(e.target.value)}/>
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div>
                    <label>Confirm</label>
                    <input type="password" value={confirm} required onChange={(e) => setConfirm(e.target.value)}/>
                </div>

                <button type="submit">Create</button>
            </form>
        </div>
    )
}
