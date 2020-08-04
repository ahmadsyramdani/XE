import { FETCH_PRODUCTS } from '../actions/types';

const initialState = { items: [], filteredItems: [], category: ''};

export default function(state=initialState, action){
  switch (action.type) {
    case FETCH_PRODUCTS:
      return {...state,
        items: action.payload,
        filteredItems: action.payload,
        totalPages: action.totalPages,
        totalItems: action.totalItems,
        currentPage: action.currentPage,
        category: action.payload.category
      }
    default:
      return state;
  }
}
