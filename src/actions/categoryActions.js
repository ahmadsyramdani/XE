import { FETCH_CATEGORIES } from './types';

export const fetchCategories = () => (dispatch) => {
  fetch("http://localhost/api/categories").then(res => res.json())
  .then(data => {
    return dispatch({ type:FETCH_CATEGORIES, payload: data.data.docs });
  });
}
