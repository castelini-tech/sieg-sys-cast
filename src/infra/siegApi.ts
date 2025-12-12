import axios from "axios";

export const siegApi = axios.create({
    baseURL: process.env.SIEG_API_URL,
    headers: {
        Authorization: `Bearer ${process.env.SIEG_API_TOKEN}`
    }
})

/* import axios from "axios";

export const siegApi = axios.create({
  baseURL: process.env.SIEG_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.SIEG_API_TOKEN}`,
  },
}); */