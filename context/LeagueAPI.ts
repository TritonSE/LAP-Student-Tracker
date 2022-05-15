import axios, {AxiosInstance} from "axios";
import {Class, CreateClass} from "../models/class";
import {ClassEvent, CreateClassEvent} from "../models/events";
import {CreateUser, UpdateUser, User} from "../models/users";
import {Image, UpdateImage} from "../models/images";
import firebase from "firebase/compat/app";

// LeagueAPI class to connect front and backend
class LeagueAPI {
  client: AxiosInstance;
  auth?: firebase.auth.Auth;
  token?: string;
  getNewRefreshToken?: () => Promise<string | null>;

  // Create the class
  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // intercept all responses that return a 401 and supply the correct authentication header
    // only retry once 0
    this.client.interceptors.response.use((response) => {
      return response;
    }, async (error) => {
      const HEADER_NAME = 'Authorization';
      const originalRequestConfig = error.config;
      if (error.response) {
        if (error.response.status == 401 && !originalRequestConfig._retry) {
          const newTokenCreated = await this.refreshToken();
          if (!newTokenCreated) return Promise.reject(error);
          this.token = newTokenCreated;
          originalRequestConfig._retry = true;
          delete originalRequestConfig.headers[HEADER_NAME];
          originalRequestConfig.headers[HEADER_NAME] = `Bearer ${this.token}`;
          return this.client.request(originalRequestConfig);
        }
      }
      return Promise.reject(error);
    }
  )};

  setToken(token: string): void {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setRefreshTokenFunction( func: () => Promise<string | null> ): void {
    this.getNewRefreshToken = func;
  }


  setAuth(auth: firebase.auth.Auth): void {
    this.auth = auth;
  }

  async refreshToken(): Promise<string | null> {
    if (!this.getNewRefreshToken) return null;
    return this.getNewRefreshToken();
  }

  // Get the staff from the backend
  async getStaff(): Promise<User[]> {
    await this.refreshToken();
    const res = await this.client.get("api/staff");
    return res.data;
  }

  async getClass(id: string): Promise<Class> {
    const res = await this.client.get(`api/class/${id}`);
    return res.data;
  }

  async getAllClasses(): Promise<Class[]> {
    const res = await this.client.get("api/class");
    return res.data;
  }

  async createClassEvent(classEvent: CreateClassEvent): Promise<ClassEvent> {
    const res = await this.client.post("api/events/class", classEvent);
    return res.data;
  }

  async createClass(classObj: CreateClass): Promise<Class> {
    const res = await this.client.post("api/class", classObj);
    return res.data;
  }

  async getUser(id: string): Promise<User> {
    const res = await this.client.get(`api/users/${id}`);
    return res.data;
  }

  async getImage(id: string): Promise<Image> {
    await this.refreshToken();
    const res = await this.client.get(`api/images/${id}`);
    return res.data;
  }

  async updateImage(id: string, updatedImage: UpdateImage): Promise<Image> {
   const res = await this.client.patch(`api/images/${id}`, updatedImage);
   return res.data;
  }

  async getAllUsers(role?: string): Promise<User[]> {
    const res = await this.client.get("/api/users/", { params: { role: role } });
    return res.data;
  }

  async createUser(user: CreateUser): Promise<User> {
    const res = await this.client.post("api/users/", user);
    return res.data;
  }

  async updateUser(user: UpdateUser, id: string): Promise<User> {
    const res = await this.client.patch(`api/users/${id}`, user);
    return res.data;
  }


}

export { LeagueAPI };
