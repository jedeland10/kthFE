import React, {useEffect, useState} from "react";
import {Space} from "antd";
import {Post} from "../Feed/Post";
import FeedApi from "../../api/FeedApi";

export default function UserFeed( {user, feed} ) {

    const [posts, setPosts] = useState([]);


    useEffect(()  => {
        setPosts(feed.map(p => {
            return {
                user: user,
                post: p
            }
        }))
    }, [user, feed]);


    return(
        <div>
            <Space direction={"vertical"} size={"large"} style={{display: 'flex'}}>
                {feed.length > 0 &&
                    posts.map(post => <Post key={post.post.id} post={post}/>)
                }
            </Space>
        </div>
    )
}
