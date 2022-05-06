import {
  ANNOUNCEMENT_REQUEST,
  ANNOUNCEMENT_SUCCESS,
  ANNOUNCEMENT_FAIL,
} from "../constants/announcementConstants";
import axios from "axios";

export const listAnnouncement = () => async (dispatch) => {
  try {
    dispatch({ type: ANNOUNCEMENT_REQUEST });

    const { data } = await axios.get("/api/announcement/");

    dispatch({ type: ANNOUNCEMENT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ANNOUNCEMENT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
