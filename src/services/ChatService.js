import UserService from "./UserService";

export const ChatService = (function() {
    let instance = null;
    let Stomp = require('stompjs');
    let SockJS = require('sockjs-client');

    function createInstance(token, onReceive, chatRoomId) {
        if(instance === null) {
            instance = {
                sock: new SockJS("http://localhost:8081/ws?token=" + token),
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
            instance.stompClient.send("/app/socket", {"Authorization": 'Bearer ' + instance.token}, message)
        }
    }
})();
