import './Header.css';
import React, { useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {MessageOutlined, NotificationOutlined} from "@ant-design/icons";
import {Badge, Button, Dropdown, Space} from "antd";
import UserService from "../../services/UserService";
import UserApi from "../../api/UserApi";
import SearchInput from "./SearchInput";
import FriendRequestDropdown from "./FriendRequestDropdown";

export default function Header() {
    const userService = UserService()
    const userApi = UserApi()
    const navigate = useNavigate();


    useEffect(() => {

    }, [userService.isLoggedIn()]);

    return (
        <div className={'root'}>
            <SearchInput
                placeholder="Search for users"
                style={{
                    width: 200,
                }}
            />

            <div>
                {userService.isLoggedIn() &&
                    <>
                        <NavLink style={{padding: '0px 10px 0px 10px'}} to={'/user/' + userService.getUserId()}>My profile</NavLink>

                        <Badge size={"small"} count={0}>
                            <MessageOutlined onClick={() => navigate('/chatRooms')} style={{padding: '0px 10px 0px 10px', color:'#c8c8c8',fontSize:'125%'}}/>
                        </Badge>

                        <FriendRequestDropdown/>
                    </>
                }
                {/*
                    <Badge size={"small"} count={friendRequests.length}>
                        <div>
                            <NotificationOutlined onClick={() => setOpenRequests(!openRequests)}
                                                  style={{padding: '0px 10px 0px 10px', color:'#c8c8c8',fontSize:'125%'}}/>
                            {openRequests === true &&
                                <ul className="menu">
                                    {friendRequests.length > 0 &&
                                        friendRequests.map(user =>
                                            <li className={'menu.item'}>
                                                <div>
                                                    <p>{user.firstName} {user.lastName} wants to be your friend</p>
                                                    <Button type={'primary'} size={'small'} onClick={() => acceptFriend(user.id)}>Accept</Button>
                                                    <Button type={'primary'} size={'small'} onClick={() => declineFriend(user.id)}>Decline</Button>
                                                </div>
                                            </li>
                                        )}
                                </ul>
                            }
                        </div>
                    </Badge>
                */}


            </div>
        </div>
    )
}
