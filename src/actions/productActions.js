import { FETCH_PRODUCTS } from './types';

export const fetchProducts = (page, category='') => (dispatch) => {
  const currentPage = page || 1
  const params = category ?  `?pages=${currentPage}&categoryId=${category}` : `?pages=${currentPage}`
  const baseApi = `http://localhost/api/products${params}`

  fetch(baseApi).then(res => res.json())
  .then(data => {
    return dispatch({
      type: FETCH_PRODUCTS,
      payload: data.data.docs,
      totalPages: data.data.pages,
      totalItems: data.data.total,
      currentPage: data.data.currentPage
    });
  });
}
