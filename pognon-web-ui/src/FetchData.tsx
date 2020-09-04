import axios from 'axios';

export async function FetchData(hash: string) {
    const instance = axios.create();
    if (process.env.NODE_ENV === 'development') {
        instance.defaults.baseURL = 'http://localhost:8080';
    }
    try {
        const result = await instance.get(`api/${hash}`);
        return result.data;
    } catch (err) {
        throw err;
    }
}