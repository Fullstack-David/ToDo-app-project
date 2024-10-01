import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { TodoList } from "./components/TodoList";
import { AuthProvider, useAuth } from "./context/AuthContext";

const PrivateRoute: React.FC<{
  component: React.ComponentType<any>;
  path: string;
}> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <PrivateRoute path="/todos" component={TodoList} />
              <Redirect from="/" to="/todos" />
            </Switch>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}
