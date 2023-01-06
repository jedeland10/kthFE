import React, {useEffect, useState} from "react";
import {Card, Space} from "antd";
import {Post} from "./Post";
import FeedApi from "../../api/FeedApi";
import UserApi from "../../api/UserApi";
import Chart from "../Diagram/Chart";
import ChartApi from "../../api/ChartApi";

export default function HomeFeed() {
    const feedApi = FeedApi()
    const userApi = UserApi()
    const chartApi = ChartApi()

    const [postCards, setPostCards] = useState([])
    const [chartCards, setChartCards] = useState([])


    useEffect(() => {
        feedApi.getHomeFeed()
            .then(feed => {
                feed.forEach(post => {
                    userApi.getUser(post.userId)
                        .then(user => {
                            setPostCards(prevState => [...prevState, {user: user, post: post}])
                        })
                })
            })

        userApi.getFriends()
            .then(friends => {
                friends.forEach(friend => {
                    chartApi.getChartsForUser(friend.id)
                        .then(charts => {
                            charts.forEach(chart => {
                                userApi.getUser(chart.userId)
                                    .then(user => {
                                        setChartCards(prevState => [...prevState, {user: user, chart: chart}])
                                        console.log('Fetching chart')
                                    })
                            })
                        })
                })
            })


        return () => {
            setPostCards([])
            setChartCards([])
        }
    }, [])

    return(
    <div className={'container'}>
        <div className={'row'}>
            <h2>Home</h2>

            <div className={'column-2'}>
                <h3>Friend Feed</h3>

                <Space direction={"vertical"} size={"large"} style={{display: 'flex', overflowY: 'scroll', maxHeight: '80vh'}}>
                    {postCards.length > 0 &&
                        postCards.map(post => <Post key={post.post.id} post={post}/>)
                    }
                </Space>
            </div>


            <div className={'column-2'}>
                <h3>Friend Diagrams</h3>

                <Space direction={"vertical"} size={"large"} style={{display: 'flex', overflowY: 'scroll', maxHeight: '80vh'}}>
                    {chartCards.length > 0 &&
                        chartCards.filter(chart => chart.chart.shared).map(shared =>
                            <Card title={shared.user.firstName + ' ' + shared.user.lastName + ' shared'} style={{width:'100%'}}>
                                <Chart key={shared.chart._id} currentChart={shared.chart} size={25}/>
                            </Card>
                        )
                    }
                </Space>

            </div>

        </div>
    </div>
    )
}
