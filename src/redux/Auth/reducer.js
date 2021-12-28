import { LOGIN_PENDING, LOGIN_FULFILLED, LOGIN_REJECTED, SET_AUTHENTICATION } from './actions';

const initialState = {
  isLoading: false,
  authenticated: false,
  error: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_PENDING: {
      return {
        ...state,
        isLoading: true,
        error: initialState.error
      };
    }
    case LOGIN_FULFILLED: {
      return {
        ...state,
        isLoading: false,
        authenticated: true
      };
    }
    case LOGIN_REJECTED: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }
    case SET_AUTHENTICATION: {
      return {
        ...state,
        authenticated: true
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
