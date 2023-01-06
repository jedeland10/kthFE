import {Badge, Button, Dropdown} from "antd";
import {NotificationOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import UserApi from "../../api/UserApi";
import UserService from "../../services/UserService";

function FriendRequestDropdown() {
    const userApi = UserApi()

    const [friendRequests, setFriendRequests] = useState([])


    useEffect(() => {

        userApi.getFriendRequests()
            .then(friendRequests => {
                console.log("FRIEND REQUESTS")
                console.log(friendRequests)
                setFriendRequests(friendRequests ?? [])
            });

    }, [])

    function acceptFriend(id) {
        userApi.acceptFriendRequest({friendId: id})
            .then(resp => {
                setFriendRequests(friendRequests => friendRequests.filter(friendRequests => friendRequests !== id));
                console.log(resp)
            })
    }

    function declineFriend(id) {
        userApi.denyFriendRequest({friendId: id})
            .then(resp => {
                setFriendRequests(friendRequests => friendRequests.filter(friendRequests => friendRequests !== id));
                console.log(resp)
            })
    }

    function getDropdownItems() {
        if (friendRequests !== null && friendRequests.length > 0) {
            return friendRequests.map(user => {
                return {
                    label:
                        <div>
                            <p>{user.firstName} {user.lastName}</p>
                            <Button type={'primary'} size={'small'} onClick={() => acceptFriend(user.id)}>Accept</Button>
                            <Button type={'primary'} size={'small'} onClick={() => declineFriend(user.id)}>Decline</Button>
                        </div> ,
                    key: user.id
                }
            })
        }

        return [{
            label: <p>No friend requests</p>
        }]
    }

    return (
        <Dropdown
            menu={{items: getDropdownItems()}}
            trigger={['click']}
        >
            <a onClick={(e) => e.preventDefault()}>
                <Badge size={"small"} count={friendRequests.length}>
                    <NotificationOutlined style={{padding: '0px 10px 0px 10px', color:'#c8c8c8',fontSize:'125%'}}/>
                </Badge>
            </a>
        </Dropdown>
    )
}

export default FriendRequestDropdown
