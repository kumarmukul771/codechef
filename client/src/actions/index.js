import Axios from "axios";
import { get } from "lodash";
import * as actionTypes from "./types";

// User actions
export const setUser = (user) => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      createdUser: user,
    },
  };
};
// ============================================================================================== //
// ==================================  Authentication For user ================================== //
// ============================================================================================== //
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};
export const authSuccess = (token, userId, username) => {
  console.log(token, userId, username);
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    userId: userId,
    username,
  };
};

export const checkAuthTimeOut = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      console.log("Logout dispatched from setTime out");
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authCheckState = () => {
  console.log("Auth check state running");
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (token) {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      console.log("Token received");
      if (expirationDate > new Date()) {
        console.log("Success");
        dispatch(authSuccess(token, userId, username));
        dispatch(
          checkAuthTimeOut(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      } else {
        console.log("Failure");
      }
    } else {
      console.log("Logout dispatched");
      dispatch(logout());
    }
  };
};

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER,
  };
};
// ===============================================================================================//
// ===============================================================================================//
// ===============================================================================================//

export const addTag = (tag) => {
  return {
    type: actionTypes.ADD_TAG,
    payload: {
      tag,
    },
  };
};

export const removeTag = (tag) => {
  return {
    type: actionTypes.REMOVE_TAG,
    payload: {
      tag,
    },
  };
};

export const removeAllTags = () => {
  return {
    type: actionTypes.REMOVE_ALL_TAGS,
  };
};

export const addAllTags = (allTags) => {
  console.log("Action", allTags);
  return {
    type: actionTypes.ALL_TAGS,
    payload: {
      allTags,
    },
  };
};

// Problem to selected tags
export const addProblemToSelectedTag = () => {
  return async (dispatch, getState) => {
    try {
      let tags = getState().applyTags.tags;
      console.log(tags);
      let res = await Axios.post("https://powerful-coast-07208.herokuapp.com/api/problem/" + 0, {
        tags: tags,
        user_id: getState().user.userId,
      });

      console.log(res);

      dispatch(addProblem(res.data));
      dispatch(removeAllTags());
    } catch (err) {
      console.log(err);
      this.setState({
        loading: false,
        error: true,
      });
    }
  };
};

const addProblem=(data)=>{
  return {
    type:actionTypes.ADD_PROBLEMS,
    payload:data
  }
}
