import UserService from "./UserService";
import config from "../config";

export const ChatService = (function() {
    let instance = null;
    let Stomp = require('stompjs');
    let SockJS = require('sockjs-client');

    let socketUrl = config.chatApi+"/ws"

    function createInstance(token, onReceive, chatRoomId) {
        if(instance === null) {
            instance = {
                sock: new SockJS(socketUrl+"?token="+token),
                stompClient: null,
                onReceive: onReceive,
                chatRoomId: chatRoomId,
                subscription: null
            }
            instance.stompClient = Stomp.over(instance.sock)
        }
    }

    const onConnected = () => {
        console.log('connected')

        instance.subscription = instance.stompClient.subscribe('/chat-room/' + instance.chatRoomId + '/queue/messages', instance.onReceive)

        // stompClient.send("/app/socket", {"Authorization": 'Bearer ' + cookies.user.token}, " ny message")
    }

    const onError = (error) => {
        console.log('error ' + error)
        instance = null
    }

    return {
        connect: function (onReceive, chatRoomId, token) {
            createInstance(token, onReceive, chatRoomId)

            instance.stompClient.connect({}, onConnected, onError)
        },
        disconnect: function() {
            instance.subscription.unsubscribe()
            instance = null
        },
        sendMessage: function (message) {
            console.log(instance)
            instance.stompClient.send("/app/socket", {"Authorization": 'Bearer ' + instance.token}, message)
        }
    }
})();
