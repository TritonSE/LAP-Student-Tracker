import axios, { AxiosInstance, AxiosResponse } from "axios";
import { string } from "fp-ts";
import { User } from "../models/users";

// LeagueAPI class to connect front and backend
class LeagueAPI {
  client: AxiosInstance;
  token?: string;

  // Create the class
  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // setToken(token: string): void {
  //   this.token = token;
  //   this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // }

  // Get the staff from the backends
  async getStaff(): Promise<User[]> {
    const res = await this.client.get("api/staff");
    return res.data;
  }

  async getUser(id: string): Promise<User> {
    const res = await this.client.get(`api/users/${id}`)
    return res.data
  }

  async createUser(user: User) {
    const res = await this.client.post(`api/users/`, user)
    return res.data
  }
}

export { LeagueAPI };
