const prod = {
    userApi: "https://api1.data5.dev.kthcloud.com",
    chatApi: "https://api2.data5.dev.kthcloud.com",
    feedApi: "https://api3.data5.dev.kthcloud.com",
    whiteboardApi: "https://api4.data5.dev.kthcloud.com",
    diagramApi: "https://api5.data5.dev.kthcloud.com"
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
