import axios, { AxiosInstance, AxiosResponse } from "axios";
import { User } from "../models/users";

class LeagueAPI {
  client: AxiosInstance;
  token?: string;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getStaff(): Promise<User[]> {
    // console.log("ran")
    const res = await this.client.get("api/staff");
    return res.data;
  }

  async tempGetStaff(): Promise<AxiosResponse<any, any>> {
    console.log("ran")
    return this.client.get("api/staff");
  }
}

export { LeagueAPI };
