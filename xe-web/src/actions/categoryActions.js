import { FETCH_CATEGORIES } from './types';
import { BASE_API } from '../global';

export const fetchCategories = () => (dispatch) => {
  fetch(`${BASE_API}/api/categories`).then(res => res.json())
  .then(data => {
    return dispatch({ type:FETCH_CATEGORIES, payload: data.data.docs });
  });
}
