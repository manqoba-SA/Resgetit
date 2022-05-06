import axios from "axios";

export const authAxios = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`,
  },
});
