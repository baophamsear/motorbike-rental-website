import { createContext, useReducer, useContext, useEffect } from "react";
import MyReducer, { AUTH, initialAuthState } from "./MyReducer"; 
import { jwtDecode } from "jwt-decode"; 

const MyUserContext = createContext();
const MyDispatchContext = createContext();

export function MyProvider({ children }) {
  const [state, dispatch] = useReducer(MyReducer, initialAuthState);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const { token } = JSON.parse(storedAuth);
        const decoded = jwtDecode(token);
        const role = decoded.roles?.[0]?.authority;
        const email = decoded.sub;

        // Dispatch đúng user
        dispatch({
          type: AUTH.LOGIN,
          user: { email, role },
          token
        });

        console.log("Khôi phục đăng nhập từ localStorage:", { email, role });
      } catch (err) {
        console.error("Lỗi khi parse hoặc decode token:", err);
      }
    }
  }, []);


  return (
    <MyUserContext.Provider value={state}>
      <MyDispatchContext.Provider value={{ dispatch }}>
        {children}
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
}


// export function useMyState() {
//   return useContext(MyUserContext);
// }

// export function useMyActions() {
//   return useContext(MyDispatchContext);
// }

export const useMyState = () => useContext(MyUserContext);
export const useMyActions = () => useContext(MyDispatchContext);

export { MyUserContext, MyDispatchContext };