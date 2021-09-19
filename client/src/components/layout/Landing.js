import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Developer Connector</h1>
          <p className="lead">
            Create developer profile/ portfolio, share post and get help from
            other developers
          </p>
          <dev className="buttons">
            <Link to="/register" className="btn btn-tertiary">
              {" "}
              Sign Up{" "}
            </Link>
            <Link to="/login" className="btn btn-success">
              {" "}
              Login{" "}
            </Link>
          </dev>
        </div>
      </div>
    </section>
  );
};

export default Landing;
