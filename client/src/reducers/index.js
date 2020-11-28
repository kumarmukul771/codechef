import * as actionTypes from "../actions/types";
import { combineReducers } from "redux";
const initialUserState = {
  token: null,
  userId: null,
  username: null,
  tags: [],
};

const initialapplyTagsState = {
  tags: [],
  allTags: [],
};

const problemsState = {
  problems: [],
  offset: 0,
};

const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.createdUser,
        isLoading: false,
      };
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false,
      };
    case actionTypes.AUTH_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.token || localStorage.getItem("token"),
        userId: action.userId || localStorage.getItem("userId"),
        username: action.username || localStorage.getItem("username"),
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        userId: null,
        username: null,
      };
    default:
      return state;
  }
};

const applyTags_reducer = (state = initialapplyTagsState, action) => {
  console.log("Reducer", action.payload, action.type);
  switch (action.type) {
    case actionTypes.ALL_TAGS:
      return {
        ...state,
        allTags: action.payload.allTags,
      };
    case actionTypes.ADD_TAG:
      if (state.tags.indexOf(action.payload.tag) === -1) {
        return {
          ...state,
          tags: [...state.tags, action.payload.tag],
        };
      } else {
        return state;
      }
    case actionTypes.REMOVE_TAG:
      return {
        ...state,
        tags: state.tags.filter((tag) => tag !== action.payload.tag),
      };
    case actionTypes.REMOVE_ALL_TAGS:
      return {
        ...state,
        tags: [],
      };

    default:
      return state;
  }
};

const problem_reducer = (state = problemsState, action) => {
  switch (action.type) {
    case actionTypes.ADD_PROBLEMS:
      return {
        ...state,
        problems: action.payload,
      };

    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer,
  applyTags: applyTags_reducer,
  problems: problem_reducer,
});

export default rootReducer;
