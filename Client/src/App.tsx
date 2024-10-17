import "./App.css";
import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";
import { UserProvider } from "./context";

function App() {
  const routing = useRoutes(routes);
  return (
    <>
      <UserProvider>
        <Suspense fallback={<div>Loading...</div>}>{routing}</Suspense>
      </UserProvider>
    </>
  );
}

export default App;
