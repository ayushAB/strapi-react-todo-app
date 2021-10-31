import React from "react"
import {Link,useHistory} from "react-router-dom";
import axios from 'axios'
import { useSignIn,useIsAuthenticated } from 'react-auth-kit'

export default function RegistrationPage() {
  const isAuthenticated = useIsAuthenticated();
  const history = useHistory();
  if(isAuthenticated()){
      // Redirect to Dashboard
      history.push("/dashboard");
  }
  const signIn = useSignIn();
  const [error , setError] = React.useState({errorMessage:'',hasError: false});
  const [state, setState] = React.useState({username:'' ,email: '', password: ''});
   const onSubmit = async (e) => {
      e.preventDefault()
      try{
        const res = await axios.post('/auth/local/register', state);
        if(res.status === 200){
          console.log(res)
          if(signIn({
            token: res.data.jwt,
            tokenType: "Bearer",
            authState: res.data.user,
            expiresIn: 86400000
          })){
              // Redirect or do-something
          }
        }
      }catch (errorres){
        setError( () =>{
          return {
            errorMessage: errorres.response.data.data[0].messages[0].message,
            hasError: true 
          }
        });
      }
     
          
  }
  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://cdn-icons.flaticon.com/png/512/359/premium/359268.png?token=exp=1635612186~hmac=dc12cb1ef3bbaa6c2941a29a6ba169f3"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Register</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={onSubmit} >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-3">
              
              <div>
                <label htmlFor="password" className="sr-only">
                 Username
                </label>
                <input
                  id="password"
                  name="password"
                  type="text"
                  autoComplete="current-password"
                  required
                  className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  onChange={(e)=>setState({...state, username: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  onChange={(e)=>setState({...state, email: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  onChange={(e)=>setState({...state, password: e.target.value})}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
            <div className="text-center w-full mt-6">
              <span className="text-sm font-extrabold text-red-400">{ error.errorMessage }</span>
            </div>
            <div className="text-center w-full mt-6">
              <Link className="text-sm font-extrabold text-gray-400 " to="/">Already have a account?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
    
  )
  
}
