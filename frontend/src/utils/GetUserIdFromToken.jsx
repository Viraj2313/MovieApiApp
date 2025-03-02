import axios from "axios";
import { API_URL } from "../config";
export const getUserIdFromToken = async (setUserId) => {
  try {
    const response = await axios.get(`${API_URL}/api/get-user-id`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      setUserId(response.data.userId);
    }
  } catch (error) {
    console.log(error);
  }
};
