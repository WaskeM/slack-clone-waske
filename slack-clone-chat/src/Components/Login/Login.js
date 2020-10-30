import React from "react";
import "./Login.css";
import { Button } from "@material-ui/core";
import { auth, provider } from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";

function Login() {
  const [state, dispatch] = useStateValue();
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then(result => {
        console.log(result);
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user
        });
      })
      .catch(error => {
        alert(error.message);
      });
  };
  return (
    <div className="login">
      <div className="login-container">
        <img
          src="https://is1-ssl.mzstatic.com/image/thumb/Purple124/v4/7d/55/f3/7d55f369-457d-a0e1-753e-3deb0d7689ad/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/246x0w.png"
          alt="SLACK ICON"
        />
        <h1>Sign in to mySlack</h1>
        <p></p>
        <Button onClick={signIn}>Sign In with Google</Button>
      </div>
    </div>
  );
}

export default Login;
