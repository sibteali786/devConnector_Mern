import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Success");
  };
  const { email, password } = formData;
  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead text-main">
        <i className="fa fa-user text-main"></i> Sign Into Your Account
      </p>
      <form onSubmit={(e) => onSubmit(e)} className="form text-main">
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>

        <input type="submit" value="Login" className="btn btn-accent" />
      </form>
      <p className="my-1 text-main">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

export default Login;
