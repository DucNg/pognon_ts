import axios from 'axios';
import { PognonJSON } from './data';

export async function FetchData(hash: string): Promise<PognonJSON> {
    const instance = axios.create();
    if (process.env.NODE_ENV === 'development') {
        instance.defaults.baseURL = 'http://localhost:8080';
    }
    try {
        const result = await instance.get(`api/pognon/${hash}`);
        return result.data;
    } catch (err) {
        throw err;
    }
}