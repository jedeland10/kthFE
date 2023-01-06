import {Card} from "antd";
import React from "react";
import {format} from "date-fns";

export function Post({post}) {

    return(
        <Card title={post.user.firstName + ' ' + post.user.lastName + ' posted'} style={{width:'100%'}}>
            <p>{post.post.bodyText}</p>
            <p>Posted at {format(new Date(post.post.postedAt), 'yyyy-MM-dd')}</p>
        </Card>
    )
}

