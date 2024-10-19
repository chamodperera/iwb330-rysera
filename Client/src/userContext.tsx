import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { User, Order, FileState } from "./types";
import { handleLogin } from "./services/auth";

// Define the context value type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  fileStates: FileState[]; // Add fileStates
  setFileStates: Dispatch<SetStateAction<FileState[]>>; // Add setFileStates
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the provider component
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [fileStates, setFileStates] = useState<FileState[]>([]);

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
    <UserContext.Provider
      value={{ user, setUser, orders, setOrders, fileStates, setFileStates }}
    >
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
