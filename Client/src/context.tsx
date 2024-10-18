import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { User, Order } from "./models";
import { handleLogin } from "./services/auth";

// Define the context value type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the provider component
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const jwtToken = sessionStorage.getItem("googleAuthToken");
      if (jwtToken) {
        const loggedInUser = await handleLogin();
        setUser(loggedInUser);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, orders, setOrders }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
const UseUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UseUser, UserProvider };
