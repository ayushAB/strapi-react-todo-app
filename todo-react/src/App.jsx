
import LoginPage from './Pages/Login/index'
import RegisterPage from './Pages/Registration/index'
import Dashboard from './Pages/Dashboard/index'
import {BrowserRouter, Route} from "react-router-dom"
import { AuthProvider ,PrivateRoute } from 'react-auth-kit'
function App() {
   
  return (
    <div className="h-full bg-gray-900">
      <AuthProvider authType = {'cookie'}
                  authName={'_auth'}
                  cookieDomain={window.location.hostname}
                  cookieSecure={window.location.protocol === "https:"}>
                    <BrowserRouter>
            <Route component={LoginPage} path={'/'} exact/>
            <Route component={RegisterPage} path={'/register'} exact/>
            <PrivateRoute component={Dashboard} path={'/dashboard'} loginPath={'/'} exact/>
        </BrowserRouter>
    </AuthProvider>
    </div>
  );
}

export default App;
