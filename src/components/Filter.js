import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchCategories } from '../actions/categoryActions';
import { fetchProducts } from '../actions/productActions';

class Filter extends Component {
  componentDidMount(){
    this.props.fetchCategories()
  }
  render() {
    const productCategories = this.props.categories.map(category => (
        <option value={category.id} key={category.id}> {category.name} </option>
      )
    )
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            {this.props.totalItems} product found.
          </div>
          <div className="col-md-6">
            <label>
              Category
              <select className="form-control" value={this.props.category}
              onChange={(e) => this.props.fetchProducts(this.props.currentPage, e.target.value)}>
                <option value=""> All </option>
                {productCategories}
              </select>
            </label>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  categories: state.categories.items,
  products: state.products.items,
  category: state.products.category,
  totalItems: state.products.totalItems,
  currentPage: state.products.currentPage
});

export default connect(mapStateToProps, {fetchCategories, fetchProducts})(Filter);
