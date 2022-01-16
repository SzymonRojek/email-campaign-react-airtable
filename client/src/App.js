import AppContainer from "./AppContainer";
import "./App.css";
import LoginForm from "./components/LoginForm/LoginForm";
import { useStateWithLocalStorage } from "./useStateWithLocalStorage";

const App = () => {
  const [loginValue, setLoginValue] = useStateWithLocalStorage("login");
  const defaultLogIn = "admin";

  return (
    <div className="page-container">
      {loginValue === defaultLogIn ? (
        <AppContainer setLoginValue={setLoginValue} />
      ) : (
        <LoginForm setValue={setLoginValue} />
      )}
    </div>
  );
};

export default App;
