import React, { Component } from 'react'
import util from '../util';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addToCart, removeFromCart } from "../actions/cartActions";

class Basket extends Component {
  render() {
    const { cartItems } = this.props;
    return (
      <div className="alert alert-info">
        {cartItems.length === 0 ? "Basket is empty": <div>You have {cartItems.length} product in the basket.</div>}
        {cartItems.length > 0 &&
          <div className="row">
            <div className="col-md-12">
              <ul className="list-group">
                {cartItems.map(item =>
                  <li key={item.name} className="list-group-item d-flex justify-content-between align-items-center list-group-item-info">
                    <b>{util.textTruncate(item.name, 10, '..')}</b> X {item.quantity} = {util.formatCurrency(item.price * item.quantity)}
                    <span style={{float: "right"}}>
                      <button className="btn btn-danger"
                      onClick={() => this.props.removeFromCart(this.props.cartItems, item)}
                      >X</button>
                    </span>
                  </li>)}
              </ul>
              <div className="col-md-12">
                Total: {util.formatCurrency(cartItems.reduce((a, c) => a + c.price*c.quantity, 0))}
              </div>
              <div className="col-md-12">
                <Link to="/checkout" className="btn btn-primary">Checkout</Link>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cartItems: state.cart.items
});
export default connect(mapStateToProps, { addToCart, removeFromCart })(Basket);
