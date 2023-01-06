import {PostForm} from "../Feed/PostForm";
import React, {useEffect, useState} from "react";
import UserFeed from "./UserFeed";
import {useNavigate, useParams} from "react-router-dom";
import {UserAddOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import UserService from "../../services/UserService";
import Chart from "../Diagram/Chart";
import ChartApi from "../../api/ChartApi";
import UserApi from "../../api/UserApi";
import FeedApi from "../../api/FeedApi";

export function UserPage() {
    const userService = UserService();
    const userApi = UserApi()
    const chartApi = ChartApi();
    const feedApi = FeedApi();

    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({});

    const [charts, setCharts] = useState([]);

    const [friends, setFriends] = useState([])

    const [feed, setFeed] = useState([])

    useEffect(() => {
        userApi.getUser(userId)
            .then(u => {
                setUser(u ?? {})
            })

        chartApi.getChartsForUser(userId)
            .then(c => {
                setCharts(c ?? [])
            })

        userApi.getFriends()
            .then(f => {
                setFriends(f ?? [])
            })

        feedApi.getUserFeed(userId)
            .then(f => {
                setFeed(f ?? [])
            })

    },[userId]);

    function addFriend() {
        if (userId !== userService.getUserId() && !friends.find(friend => friend.id === userId)) {
            userApi.addFriend({friendId: userId})
                .then(resp => {
                    console.log(resp)
                    setFriends(old => old.filter(friend => friend.id !== userId))
                })
        }
    }

    const isMyProfile = (user.id === userService.getUserId())

    return(
        <div className={'container'}>

            <div className={'row'}>
                <div>
                    <h2>{user.firstName} {user.lastName}'s profile</h2>

                    {!isMyProfile && !friends.find(friend => friend.id === userId) &&
                        <Tooltip title={'Add friend'} placement={"bottom"}>
                            <UserAddOutlined style={{fontSize: '200%'}} onClick={addFriend}/>
                        </Tooltip>
                    }
                </div>


                <div className={isMyProfile? 'column-3' : 'column-2'}>
                    <h3>Posts</h3>
                    {isMyProfile &&
                        <div>
                            <PostForm setFeed={setFeed}/>
                        </div>
                    }

                    <div className={'column-content'}>
                        <UserFeed feed={feed} user={user} />
                    </div>
                </div>

                <div className={isMyProfile? 'column-3' : 'column-2'}>
                    <h3>Shared Diagrams</h3>

                    <div className={'column-content'}>
                        {charts.length > 0 &&
                            charts.filter(chart => chart.shared).map(shared =>
                                <>
                                    <Chart key={shared._id} currentChart={shared} size={30}/>
                                </>
                            )
                        }
                    </div>
                </div>

                {isMyProfile &&
                    <div className={'column-3'}>
                        <h3>Friends</h3>
                        <div className={'column-content'}>
                            {friends.length > 0 &&
                                friends.map(friend =>
                                    <div>
                                        <a key={friend.id} onClick={() => navigate('/user/' + friend.id)}>{friend.firstName} {friend.lastName}</a>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }

            </div>

        </div>
    )
}
