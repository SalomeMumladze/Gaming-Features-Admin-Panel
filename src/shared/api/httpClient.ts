import axios from "axios";

export const apiGateway = axios.create({
  baseURL: "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
});
