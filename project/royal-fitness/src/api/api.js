import axios from "axios";

const API = axios.create({
  baseURL: "http://172.20.10.9:5001/api",
});

export default API;