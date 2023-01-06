import './ChatRooms.css'
import React, {useEffect, useState} from "react";
import {Button, Drawer, Space, Table, Tooltip, Dropdown, Modal} from "antd";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
import {format} from "date-fns";
import UserService from "../../services/UserService";
import {useNavigate} from "react-router-dom";
import {ChatService} from "../../services/ChatService";
import UserApi from "../../api/UserApi";
import ChartApi from "../../api/ChartApi";
import Chart from "../Diagram/Chart";
import ChatApi from "../../api/ChatApi";
import {isNullOrUndef} from "chart.js/helpers";
import config from "../../config";

export function ChatRooms() {
    const [chatRooms, setChatRooms] = useState([]);
    const [open, setOpen] = useState(false);
    const [chatRoomId, setChatRoomId] = useState(null);
    const [chatMessages, setChatMessages] = useState([])
    const [chatMessage, setChatMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [users, setUsers] = useState([]);
    const [chartsInChat, setChartsInChat] = useState([])
    const [allChartsForUser, setAllChartsForUser] = useState([])

    /*
    <Tabs defaultActiveKey={'1'} items={[
        {
            label: 'Chat',
            key: '1',
            children: "chat"
        },
        {
            label: 'Whiteboard',
            key: '2',
            children: "whiteboard"
        }]}/>*/

    const columns = [
        {title: 'First name', dataIndex: 'firstName', key: 'username'},
        {title: 'Last name', dataIndex: 'lastName', key: 'username'},
        {title: '', dataIndex: '', render: (record) => (
                <DeleteOutlined onClick={() => removeParticipant(record.username)}/>)}
    ];


    let navigate = useNavigate();

    let socket = ChatService
    let userService = UserService();
    const userApi = UserApi()
    const chartApi = ChartApi()
    const chatApi = ChatApi()

    useEffect(() => {
        fetchChatRooms().then(console.log(chatRooms));
        chartApi.getChartsForUser(userService.getUserId())
            .then(resp => {
                setAllChartsForUser(resp ?? [])
            })
    }, []);

    const onReceive = (message) => {
        let chat = JSON.parse(message.body)

        if (chat.messageType === 'DATA') {
            chartApi.getChart(chat.message)
                .then(chart => {
                    if (!isNullOrUndef(chart)) {
                        setChartsInChat(prevState => [...prevState, chart])
                    }
                    setChatMessages(chatMessages => [...chatMessages, chat])
                })
        }

        else {
            setChatMessages(chatMessages => [...chatMessages, chat])
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const openChatRoom = async (id) => {
        await fetchChat(id);
        socket.connect(onReceive, id, userService.getToken())

        setOpen(true)
    };

    const onClose = () => {
        socket.disconnect()
        setChatRoomId(null)
        setChatMessages(null)
        setOpen(false);
    }

    const openNewChat = () => {
        setChatRoomId(null)
        setOpen(true)
    }

    const closeNewChat = () => {
        setChatRoomId(null)
        setChatMessages(null)
        setOpen(false)
    }

    const addParticipants = () => {
        showModal();
    }

    const addParticipant = (user) => {
        if(!participants.includes(user)) {
            setParticipants((participants) => [...participants, user]);
        }
    };

    const removeParticipant = (username) => {
        setParticipants(participants => participants.filter(user => user.username !== username));
    };

    const sendMessage = async (event) => {
        event.preventDefault();
        if (chatRoomId != null) {
            socket.sendMessage(JSON.stringify({
                senderId: userService.getUserId(),
                message: chatMessage,
                chatRoomId: chatRoomId
            }))
        } else {
            try {
                console.log(JSON.stringify({
                    senderId: userService.getUserId(),
                    message: chatMessage,
                    receiversId: participants.map(user => user.id)
                }))
                const response = await fetch(config.chatApi+'/chat/new', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userService.getToken()
                    },
                    body: JSON.stringify({
                        senderId: userService.getUserId(),
                        message: chatMessage,
                        receiversId: participants.map(user => user.id)
                    })
                });
                const responseJson = await response.json();
                console.log(responseJson);
            } catch (e) {
                console.log(e);
            }
        }
    };

    function sendChartMessage(chartId) {
        socket.sendMessage(JSON.stringify({
            senderId: userService.getUserId(),
            message: chartId,
            chatRoomId: chatRoomId,
            messageType: 'DATA'
        }))
    }

    const searchUser = async (event) => {
        event.preventDefault();
        if (event.target.value.length > 0) {
            try {
                const response = await fetch(config.userApi+'/search/' + event.target.value, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + userService.getToken()
                    }
                });
                const responseJson = await response.json();
                setUsers(responseJson);
            } catch (e) {
                console.log(e);
            }
        } else {
            setUsers([]);
        }
    }

    const fetchChatRooms = async () => {
        try {
            const response = await fetch(config.chatApi + '/chat/all/' + userService.getUserId(), {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userService.getToken()
                }
            });
            setChatRooms(await response.json());
        } catch (e) {
            console.log(e);
        }
    };

    const fetchChat = async (chatRoomId) => {
        try {
            const response = await fetch(config.chatApi+'/chat/' + chatRoomId, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userService.getToken()
                }
            });
            const responseJson = await response.json();
            console.log(responseJson);
            setChatRoomId(responseJson.id);
            setChatMessages(responseJson.chatMessages);

            for (const i in responseJson.chatMessages) {
                const chatMessage = responseJson.chatMessages[i]
                if (chatMessage.messageType === 'DATA') {
                    chartApi.getChart(chatMessage.message)
                        .then(chart => {
                            if (!isNullOrUndef(chart)) {
                                setChartsInChat(prevState => [...prevState, chart])
                            }
                        })
                }
            }

        } catch (e) {
            console.log(e);
        }
    }

    function getDropdownItems() {
        if (allChartsForUser !== null && allChartsForUser.length > 0) {
            return allChartsForUser.map(chart => {
                return {
                    label:
                        <div>
                            <p onClick={() => sendChartMessage(chart._id)}>{chart.title}</p>
                        </div> ,
                    key: chart._id
                }
            })
        }

        return [{
            label: <p>No Charts</p>
        }]
    }

    return(
        <div style={{width:'100%', height:'100%'}}>
            <Space direction={"vertical"} style={{display: 'flex'}}>
                <div className={'chatRoomContainer'}>
                    <h1>Chat rooms</h1>
                    <Tooltip title={'New message'} placement={"left"}>
                        <FormOutlined onClick={openNewChat} style={{fontSize: '200%',alignSelf:'center', marginRight:'25px'}}/>
                    </Tooltip>
                </div>
                <div>
                    {chatRooms.map(chatRoom => <p onClick={() => openChatRoom(chatRoom.id)}>{chatRoom.participantsId[0]}</p>)}
                </div>
            </Space>

            <Drawer
                style={{height:'100%', flexDirection:'row'}}
                title={'Chat room'}
                placement="right"
                size={'medium'}
                onClose={chatRoomId ? onClose : closeNewChat}
                open={open}
                extra={
                    <Space>
                        {chatRoomId == null &&
                            <Button onClick={addParticipants}>Participants</Button>
                        }

                        <Dropdown
                            menu={{items: getDropdownItems()}}
                            trigger={['click']}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Button type="primary">
                                    Send Chart
                                </Button>
                            </a>
                        </Dropdown>



                        <Button type="primary" onClick={() => navigate('/whiteboard/' + chatRoomId)}>
                            Whiteboard
                        </Button>
                        <Modal title="Add users" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <div className={'container'}>
                                <div>
                                    <input type={'text'} placeholder={'Search for user'} id={'searchString'} onChange={searchUser}/>
                                    {users.map((user) => <div className={'container'}>{user.firstName} {user.lastName}<PlusOutlined onClick={() => addParticipant(user)}/></div>)}
                                </div>
                                <div>
                                    <Table columns={columns} dataSource={participants}/>
                                </div>
                            </div>
                        </Modal>
                    </Space>
                }
            >


                <Space direction={"vertical"} size={"middle"} style={{display: 'flex', height:'100%'}}>
                    {open && chatRoomId != null &&
                        chatMessages.map(chatMessage => {
                            let messageBody
                            if (chatMessage.messageType === 'DATA') {
                                const currentChart = chartsInChat.find(chart => chart._id === chatMessage.message)
                                if (!isNullOrUndef(currentChart)) {
                                    messageBody = <Chart key={chatMessage.message} currentChart={currentChart} size={15}/>
                                }
                                else {
                                    messageBody = <p>Chart not found</p>
                                }
                            }
                            else {
                                messageBody = <p>{chatMessage.message}</p>
                            }

                            return (
                                <div className={'message-container'}>
                                    {messageBody}
                                    <br/>
                                    <p>Sent by: {chatMessage.senderId}</p>
                                    <p>Sent at: {format(new Date(chatMessage.sentAt), 'yyyy-MM-dd')}</p>
                                </div>
                            )
                        })
                    }
                    <form className={'messageForm'} onSubmit={sendMessage}>
                        <input type="text" required placeholder={'Send new message'} onChange={(e) => setChatMessage(e.target.value)}/>
                        <button style={{width: '20%', alignSelf:"center"}} type="submit">Send</button>
                    </form>
                </Space>


            </Drawer>
        </div>
    )
}
