import axios from "axios";

export default function api (url: string) {
  return axios.create({
    baseURL: url
  });
}

export const req01 = api("http://localhost:3333");
