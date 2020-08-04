import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form'
import productReducer from './productReducer';
import categoryReducer from './categoryReducer';
import cartReducer from './cartReducer';

export default combineReducers({
  products: productReducer,
  categories: categoryReducer,
  cart: cartReducer,
  form: formReducer
})
