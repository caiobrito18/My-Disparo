import axios from "axios";

export default function api (url: string) {
  return axios.create({
    baseURL: url
  });
}

export const req01 = api("https://api01.siriusalpha.com.br");
