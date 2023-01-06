import "./whiteboard.css";
import io from "socket.io-client";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {Button} from "antd";
import UserService from "../../services/UserService";
import config from "../../config";

function WhiteBoard() {
    let { id } = useParams();

    let userService = UserService();

    let timeout;
    let socket = io.connect(config.whiteboardApi, {
        auth: {
            token: userService.getToken()
        }
    });

    const saveWhiteboard = () => {
        let canvas = document.querySelector("#board");
        let base64ImageData = canvas.toDataURL("image/png");
        socket.emit("save", {data: base64ImageData, roomId: id});
    }
    const clearWhiteboard = () => {
        socket.emit("clear", id);
    }

    function Board() {

        useEffect(() => {

            socket.on("canvas-data", (data) => {
                let image = new Image();
                let canvas = document.querySelector("#board");
                let ctx = canvas.getContext("2d");
                image.onload = () => {
                    ctx.drawImage(image, 0, 0);
                };
                image.src = data;
            });

            socket.on("clear",() => {
                let canvas = document.querySelector("#board");
                let ctx = canvas.getContext("2d");

                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });

            drawOnCanvas();

            socket.emit("join", id);

            return () => {
                socket.emit("leave");
            }
        });

        const drawOnCanvas = () => {
            let canvas = document.querySelector('#board');
            let ctx = canvas.getContext('2d');

            let sketch = document.querySelector('#sketch');
            let sketch_style = getComputedStyle(sketch);
            canvas.width = parseInt(sketch_style.getPropertyValue('width'));
            canvas.height = parseInt(sketch_style.getPropertyValue('height'));

            let mouse = {x: 0, y: 0};
            let last_mouse = {x: 0, y: 0};

            /* Mouse Capturing Work */
            canvas.addEventListener('mousemove', function(e) {
                last_mouse.x = mouse.x;
                last_mouse.y = mouse.y;

                mouse.x = e.pageX - this.offsetLeft;
                mouse.y = e.pageY - this.offsetTop;
            }, false);


            /* Drawing on Paint App */
            ctx.lineWidth = 5;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'blue';

            canvas.addEventListener('mousedown', function(e) {
                canvas.addEventListener('mousemove', onPaint, false);
            }, false);

            canvas.addEventListener('mouseup', function() {
                canvas.removeEventListener('mousemove', onPaint, false);
            }, false);


            let onPaint = function() {
                ctx.beginPath();
                ctx.moveTo(last_mouse.x, last_mouse.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.closePath();
                ctx.stroke();

                if(timeout !== undefined) clearTimeout(timeout);
                timeout = setTimeout(() => {
                    let base64ImageData = canvas.toDataURL("image/png");
                    socket.emit("canvas-data", {data: base64ImageData, roomId: id});
                }, 1000)
            };
        }

        return(
            <div className={"sketch"} id={"sketch"}>
                <canvas className={"board"} id={"board"}/>
            </div>
        )


    }

    return(
        <div className={'container'}>
            <div>
                <input className={"color-picket-container"} type={"color"}/>
                <Button type={"primary"} onClick={saveWhiteboard}>Save</Button>
                <Button type={"primary"} onClick={clearWhiteboard}>Clear</Button>
            </div>
            <div className={'board-container'}>
                <Board/>
            </div>
        </div>
    )
}

export default WhiteBoard
