import {
  ANNOUNCEMENT_REQUEST,
  ANNOUNCEMENT_SUCCESS,
  ANNOUNCEMENT_FAIL,
} from "../constants/announcementConstants";

export const annoncementListReducer = (
  state = { announcement: [] },
  action
) => {
  switch (action.type) {
    case ANNOUNCEMENT_REQUEST:
      return { loading: true, announcement: [] };

    case ANNOUNCEMENT_SUCCESS:
      return { loading: false, announcement: action.payload };

    case ANNOUNCEMENT_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
