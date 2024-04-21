import React, { useReducer, createContext } from "react";

const getInitialState = () => {
  const initialState = { user: null, role: null, user_id: null };
  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user_id = localStorage.getItem("user_id");
    if (token.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
    } else {
      initialState.user = token;
      initialState.role = role;
      initialState.user_id = user_id;
    }
  }
  return initialState;
};
const initialState = getInitialState();
const AuthContext = createContext({
  ...initialState,
  login: (userData) => {},
  logout: () => {},
});
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.token,
        role: action.payload.role,
        user_id: action.payload.id,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        role: null,
        user_id: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  function login(userData) {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("user_id", userData.id);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        role: state.role,
        user_id: state.user_id,
        login,
        logout,
      }}
      {...props}
    />
  );
}
export { AuthContext, AuthProvider };
