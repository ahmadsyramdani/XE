import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Link } from 'react-router-dom';
import util from '../util';
import { BASE_API } from '../global';

async function submitToServer (dataValue) {
  const baseApi = `${BASE_API}/api/orders`;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataValue)
  };
  await fetch(baseApi, requestOptions).then(res => res.json()).then(data => {
    localStorage.setItem("cartItems", []);
    return window.location.href='/success'
  }).catch(error => {
    return window.location.href='/error'
  })
}

const submit = ({ name='', email='', phoneNumber='', shippingAddress='', totalPayment='', orderItems=[]}) => {
  let error = {};
  let isError = false;

  const ProductItems = []
  orderItems.forEach((cp) => {
    ProductItems.push({
      productId: cp.id,
      quantity: cp.quantity
    })
  })

  orderItems = ProductItems

  if (name.trim() === ''){
    error.name = 'Required';
    isError = true;
  }
  if (name.length > 20){
    error.name = 'Too long';
    isError = true;
  }
  if (email.trim() === ''){
    error.email = 'Required';
    isError = true;
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
    error.email = 'Invalid email address';
    isError = true;
  }
  if (phoneNumber.trim() === ''){
    error.phoneNumber = 'Required';
    isError = true;
  }
  if (!/^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/g.test(phoneNumber)) {
    error.phoneNumber = 'Invalid Phone Number';
    isError = true;
  }
  if (shippingAddress.trim() === ''){
    error.shippingAddress = 'Required';
    isError = true;
  }

  if (isError) {
    throw new SubmissionError(error);
  } else {
    return submitToServer({ name, email, phoneNumber, shippingAddress, totalPayment, orderItems })
  }
}

const renderField = ({ type, label, input, meta: { touched, error } }) => (
  <div className="form-group">
    <label>{label}</label>
        <input {...input} placeholder={label} type={type} className="form-control" />
        {touched && error &&
          <span className='error text-danger'>{error}</span>}
  </div>
);

const CheckOutForm = props => {
  const { handleSubmit, pristine, submitting } = props;
  return (
    <form onSubmit={handleSubmit(submit)}>
      <Field name="name" label="Name" component={renderField} />
      <Field name="email" label="Email"  component={renderField} />
      <Field name="phoneNumber" label="Phone Number" component={renderField} />
      <Field name="shippingAddress" label="Shipping Address" component={renderField} />
      <hr/>
      <div className="col-md-12 text-right">
        <b>Total Shipping Cost (5% from Subtotal): { util.formatCurrency(props.shippingCost) } </b><br />
        <b>Tax { props.tax }% : { util.formatCurrency(props.subtTotalWithTax) }</b>
        <div className="alert alert-success">
          <h4>Total: {util.formatCurrency(props.totalCost)}</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Link to="/" className="btn btn-primary">Back</Link>
        </div>
        <div className="col-md-6 text-right">
          <button type="submit" disabled={pristine || submitting} className="btn btn-success">PAY NOW</button>
        </div>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'simple'
})(CheckOutForm);
