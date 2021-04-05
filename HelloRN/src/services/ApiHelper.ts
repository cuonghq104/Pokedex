import axios from "axios";
import {AxiosResponse} from "axios";

const ApiHelper = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/',
    timeout: 5 * 60 * 1000
})

// request header
ApiHelper.interceptors.request.use(async (config) => {
    console.log('Starting Request', config);
    return config;
}, (error) => Promise.reject(error));

function parseBody(response: any): AxiosResponse<any> {
    console.log('Check Response: ', response);
    if (response.status === 200) {
        return response.data
    }
    return response
}

async function handleError(error: any) {
    console.log('Error', error.response);
    return Promise.reject(error);
}

ApiHelper.interceptors.response.use((response: AxiosResponse<any>) => parseBody(response), (error) => {
    console.warn('Error status', error.response);
    // return Promise.reject(error)
    return handleError(error);
});

export default ApiHelper;