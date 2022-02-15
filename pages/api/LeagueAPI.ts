import axios, { AxiosInstance } from 'axios';  
import { User } from "../../models/users";

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
        const res = await this.client.get('api/staff');
        return res.data;
    }
}

export { LeagueAPI };