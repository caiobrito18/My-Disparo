import axios from "axios";

export default function api (url: string) {
  return axios.create({
    baseURL: url
  })
}
