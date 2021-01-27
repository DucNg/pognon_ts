import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Person, PognonJSON, Transaction } from './data';

function createAxiosInstance(): AxiosInstance {
    const instance = axios.create();
    if (process.env.NODE_ENV === 'development') {
        instance.defaults.baseURL = 'http://localhost:8080';
    }
    return instance;
}

export async function fetchData(hash: string): Promise<PognonJSON> {
    const instance = createAxiosInstance();
    try {
        const result = await instance.get(`api/pognon/${hash}`);
        return result.data;
    } catch (err) {
        throw err;
    }
}

export async function postPognon(pognon: PognonJSON): Promise<AxiosResponse<PognonJSON>> {
    const instance = createAxiosInstance();
    try {
        const result = await instance.post("api/pognon", pognon);
        return result;
    } catch (err) {
        throw err;
    }
}

export async function postTransaction(hash: string, transaction: Transaction): Promise<AxiosResponse<Transaction>> {
    const instance = createAxiosInstance();
    try {
        const result = await instance.post(`api/pognon/${hash}/transaction`, transaction);
        return result;
    } catch (err) {
        throw err;
    }

}

export async function deleteTransaction(hash: string, transaction: Transaction): Promise<AxiosResponse<Transaction>> {
    const instance = createAxiosInstance();
    try {
        const result = await instance.delete(`api/pognon/${hash}/transaction/${transaction.IDTransaction}`);
        return result;
    } catch (err) {
        throw err;
    }
}

export async function deletePerson(hash: string, person: Person): Promise<AxiosResponse<Person>> {
    const instance = createAxiosInstance();
    try {
        const result = await instance.delete(`api/pognon/${hash}/person/${person.IDPerson}`);
        return result;
    } catch (err) {
        throw err;
    }
}

export async function putPerson(hash: string, person: Person): Promise<AxiosResponse<Person>> {
    const instance = createAxiosInstance();
    try {
        const result = await instance.put(`api/pognon/${hash}/person/${person.IDPerson}`, person);
        return result;
    } catch (err) {
        throw err;
    }
}
