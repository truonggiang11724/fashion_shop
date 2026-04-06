import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';
import { data } from 'react-router-dom';

export const getCart = createAsyncThunk('cart/getCart', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/carts/${id}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Cannot fetch cart' });
  }
});

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/carts');
    return response.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Cannot fetch cart' });
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (item, { rejectWithValue }) => {
  try {
    const response = await api.post('/carts/add', item);    
    return response.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Cannot add cart item' });
  }
});

export const updateCart = createAsyncThunk('cart/updateCart', async ({ id, updates }, { rejectWithValue }) => {
  try {
    console.log(updates);

    const response = await api.put(`/carts/item/${id}`, updates);
    return response.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Cannot update cart item' });
  }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/carts/item/${id}`);
    return { id };
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Cannot remove cart item' });
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    user_cart: {},
  },
  reducers: {
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user_cart = action.payload || [];
        console.log(action.payload);
        
      })
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const added = action.payload;
        const exists = state.items.find((i) => i.id === added.id);
        
        if (exists) {
          exists.quantity = (exists.quantity || 0) + (added.quantity || 1);
        } else {
          state.items.push({ ...(added || {}), quantity: added.quantity || 1 });
        }
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        const updated = action.payload;
        if (Array.isArray(state.items)) {
          state.items = state.items.map((item) =>
            item.cart_item_id === updated.cart_item_id ? { ...item, ...updated } : item,
          );
        }
        if (state.user_cart?.cart_items) {
          state.user_cart.cart_items = state.user_cart.cart_items.map((item) =>
            item.cart_item_id === updated.cart_item_id ? { ...item, ...updated } : item,
          );
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        const { id } = action.payload;
        if (Array.isArray(state.items)) {
          state.items = state.items.filter((item) => item.cart_item_id !== id);
        }
        if (state.user_cart?.cart_items) {
          state.user_cart.cart_items = state.user_cart.cart_items.filter(
            (item) => item.cart_item_id !== id,
          );
        }
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
