import axios from "axios";

export default function api (url: string) {
  return axios.create({
    baseURL: url
  });
}

export const req01 = api(import.meta.env.VITE_URL);
