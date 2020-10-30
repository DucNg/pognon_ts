import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { PognonJSON, Transaction } from './data';

function createAxiosInstance(): AxiosInstance {
    const instance = axios.create();
    if (process.env.NODE_ENV === 'development') {
        instance.defaults.baseURL = 'http://localhost:8080';
    }
    return instance
}

export async function fetchData(hash: string): Promise<PognonJSON> {
    const instance = createAxiosInstance()
    try {
        const result = await instance.get(`api/pognon/${hash}`);
        return result.data;
    } catch (err) {
        throw err;
    }
}

export async function postTransaction(hash: string, transaction: Transaction): Promise<AxiosResponse<any>> {
    const instance = createAxiosInstance()
    try {
        const result = await instance.post(`api/pognon/${hash}/transaction`,transaction)
        return result;
    } catch (err) {
        throw err;
    }

}
