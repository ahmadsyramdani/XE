import React, { Component } from 'react'
import util from '../util';
import { connect } from 'react-redux';
import { addToCart, removeFromCart } from "../actions/cartActions";
import CheckOutForm from './CheckOutForm';
import { Link } from 'react-router-dom';

class Checkout extends Component {
  render() {
    const subTotal = this.props.cartItems.reduce((a, c) => a + c.price*c.quantity, 0);
    const tax = 10;
    const subtTotalWithTax = subTotal * (tax/100);
    const shippingCost = subTotal * (5/100);
    const totalCost = subtTotalWithTax + shippingCost + subTotal;

    return (
      <div className="container" style={{paddingBottom: '60px'}}>
        <h1>Checkout - Xen Electronic</h1>
        <hr />
        <div className="table">
          <div className="alert alert-info">
            {this.props.cartItems.length === 0 ? "Product is empty": <div>Selected product {this.props.cartItems.length} </div>}
          </div>
          {this.props.cartItems.length > 0 &&
            <div className="row">
              <div className="col-md-12">
                {this.props.cartItems.map(item =>
                  <div className="row" key={item.id}>
                    <div className="col-md-1">
                      <button className="btn btn-danger"
                        onClick={() => this.props.removeFromCart(this.props.cartItems, item)}
                        >X</button>
                    </div>
                    <div className="col-md-2"><img className="rounded img-thumbnail" src={item.imageUrl} alt={item.name} /></div>
                    <div className="col-md-4"><b>{util.textTruncate(item.name, 100, '..')}</b></div>
                    <div className="col-md-1">{util.formatCurrency(item.price)}</div>
                    <div className="col-md-1">X</div>
                    <div className="col-md-1">{item.quantity}</div>
                    <div className="col-md-2 text-right">{util.formatCurrency(item.price * item.quantity)}</div>
                  </div>)
                }
                <div className="col-md-12 text-right">
                  <h5>Subt Total: {util.formatCurrency(this.props.cartItems.reduce((a, c) => a + c.price*c.quantity, 0))}</h5>
                </div>
              </div>
            </div>
          }
        </div>

        {this.props.cartItems.length > 0 &&
          <CheckOutForm
            shippingCost={shippingCost}
            tax={tax}
            totalCost={totalCost}
            subtTotalWithTax={subtTotalWithTax}
            cartItems={this.props.cartItems}
            initialValues={
              {totalPayment: totalCost,
              orderItems: this.props.cartItems}
            }/>
        }
        {this.props.cartItems.length === 0 &&
          <div className="row">
            <div className="col-md-6">
              <Link to="/" className="btn btn-primary">Back</Link>
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  cartItems: state.cart.items,
  email: state.email,
  name: state.name,
  phoneNumber: state.phoneNumber,
  shippingAddress: state.shippingAddress
});
export default connect(mapStateToProps, { addToCart, removeFromCart })(Checkout);
