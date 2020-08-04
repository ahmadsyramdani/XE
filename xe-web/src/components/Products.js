import React, { Component } from "react";
import { connect } from "react-redux";
import util from "../util";
import { addToCart } from "../actions/cartActions";
import { fetchProducts } from "../actions/productActions";

class Products extends Component {
  componentDidMount() {
    this.props.fetchProducts();
  }
  render() {
    const productItems = this.props.products.map(product => (
      <div className="col-md-4" key={product.id}>
        <div className="thumbnail text-center">
          <img src={product.imageUrl} alt={product.name} />
          <p>
            {product.name}
          </p>
          <b>{util.formatCurrency(product.price)}</b>
          <button className="btn btn-primary" onClick={(e) => this.props.addToCart(this.props.cartItems, product)}> Add to cart </button>
        </div>
      </div>
      )
    )
    const cP = parseInt(this.props.currentPage);
    const tP = parseInt(this.props.totalPages);
    const prevLabelHandler = cP === 1 ? 'disabled' : '';
    const nextLabelHandler = cP === tP ? 'disabled' : '';
    const prevActionHandler = cP === 1 ? null : (e) => this.props.fetchProducts(cP - 1)
    const nextActionHandler = cP === tP ? null : (e) => this.props.fetchProducts(cP + 1)
    return (
      <section>
        <div className="row">
          {productItems}
        </div>
        <hr/>
        <div className="row text-center" style={{paddingBottom: '60px'}}>
          Page {this.props.currentPage} of {this.props.totalPages} <br />
          <button
            className={`btn btn-normal ${prevLabelHandler}`}
            onClick={prevActionHandler}
          >
            Previous
          </button>
          <button
            className={`btn btn-normal ${nextLabelHandler}`}
            onClick={nextActionHandler}
          >
            Next
          </button>
        </div>
      </section>
    )
  }
}
const mapStateToProps = (state) => ({
  products: state.products.filteredItems,
  cartItems: state.cart.items,
  totalPages: state.products.totalPages,
  totalItems: state.products.totalItems,
  currentPage: state.products.currentPage
});
export default connect(mapStateToProps, { fetchProducts, addToCart })(Products);
