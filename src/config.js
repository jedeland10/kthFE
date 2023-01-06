const prod = {
    userApi: "http://api1.data5.dev.kthcloud.com",
    chatApi: "http://api2.data5.dev.kthcloud.com",
    feedApi: "http://api3.data5.dev.kthcloud.com",
    whiteboardApi: "http://api4.data5.dev.kthcloud.com",
    diagramApi: "http://api5.data5.dev.kthcloud.com"
}

const dev =  {
    userApi: "http://localhost:8085",
    chatApi: "http://localhost:8081",
    feedApi: "http://localhost:8082",
    whiteboardApi: "http://localhost:8083",
    diagramApi: "http://localhost:8084"
}

const config = process.env.REACT_APP_CONTEXT === "production" ? prod : dev;

export default {
    ...config,
};
