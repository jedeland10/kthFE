import React, {useState} from "react";
import UserService from "../../services/UserService";
import FeedApi from "../../api/FeedApi";

export function PostForm({setFeed}) {
    const [text, setText] = useState('');

    let userService = UserService()
    const feedApi = FeedApi()

    const handlePost = (event) => {
        event.preventDefault();
        const newPost = {
            userId: userService.getUserId(),
            bodyText: text
        }

        feedApi.createPost(newPost)
            .then(response => {
                if (response) {
                    setFeed(old => [...old, response])
                    setText('')
                }
            })
    }

    return(
        <form onSubmit={handlePost}>
            <label>
                New post
                <input value={text} type="text" required onChange={(e) => setText(e.target.value)}/>
            </label>
            <button type="submit">Post</button>
        </form>
    )
}
