import './Sidebar.css'
import React from "react";
import {NavLink} from "react-router-dom";
import UserService from "../../services/UserService";

export default function Sidebar() {
    let userService= UserService();

    const logout = () => {
        userService.logout();
    }

    return (
        <div className={'sidebar'}>
            <p>
                <NavLink to={'/'}>Home</NavLink>
            </p>

            {!userService.isLoggedIn() &&
                <p>
                    <NavLink to={'/login'}>Login</NavLink>
                </p>
            }

            {userService.isLoggedIn() &&
                <p>
                    <NavLink onClick={logout} to={'/login'}>Log out</NavLink>
                </p>
            }

            {userService.isLoggedIn() &&
                <p>
                    <NavLink to={'/diagram'}>Diagram</NavLink>
                </p>
            }

        </div>
    )
}
