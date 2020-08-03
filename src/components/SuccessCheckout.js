import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class SuccessCheckout extends Component {
  render() {
    return (
      <div className="page-wrap d-flex flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 text-center">
              <h1>Congratulation!</h1>
              <div className="mb-4 lead">Your purchase is completed</div>
              <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SuccessCheckout;
