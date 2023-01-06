import axios from "axios";
import UserService from "../services/UserService";


function AxiosFacade(baseUrl) {

    const userService = UserService();

    const api = axios.create({
        baseURL: baseUrl,
        headers: {
            'Authorization': 'Bearer ' + userService.getToken(),
            'Accept': '*/*'
        }
    });

    async function GET(url) {
        try {
            let response = await api.get(url)
            console.log(response)
            return response.data
        } catch(e) {
            console.log(e)
            return null
        }
    }

    async function POST(url, body) {
        try {
            const response = await api.post(url, body)
            console.log(response)
            return response.data
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async function PUT(url, body) {
        try {
            const response = await api.put(url, body)
            console.log(response)
            return response.data
        } catch (e) {
            console.log(e)
            return null
        }
    }

    return {
        GET: async (url) => GET(url),

        POST: async (url, body) => POST(url, body),

        PUT: async (url, body) => PUT(url, body),

    }
}

export default AxiosFacade
