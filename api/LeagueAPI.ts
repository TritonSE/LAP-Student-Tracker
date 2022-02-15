import axios, { AxiosInstance } from 'axios';  
import { User } from "../models/users";
import useSWR from 'swr';

class LeagueAPI {
    client: AxiosInstance;
    token?: string;


    constructor(baseURL: string){
        this.client = axios.create({
            baseURL: baseURL,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    async getStaff():Promise<User[]>{
        const { data, error } = useSWR('/api/user');
        if (error) return error;
        if (!data) return data;
        return data;
    }
}

export { LeagueAPI };