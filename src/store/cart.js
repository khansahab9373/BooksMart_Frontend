import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = (action.payload || [])
        .filter((item) => item.book)
        .map((item) => ({
          ...item.book,
          price: item.book.discountPrice && item.book.discountPrice > 0
            ? item.book.discountPrice
            : item.book.price,
          discountPrice: item.book.discountPrice || 0,
          quantity: item.quantity,
        }));
    },

    addToCart: (state, action) => {
      const existingIndex = state.items.findIndex(
        (item) => item._id === action.payload._id,
      );

      const finalPrice =
        action.payload.discountPrice &&
        action.payload.discountPrice > 0 &&
        action.payload.discountPrice < action.payload.price
          ? action.payload.discountPrice
          : action.payload.price;

      if (existingIndex !== -1) {
        state.items[existingIndex].quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          price: finalPrice,
          discountPrice: action.payload.discountPrice || 0,
          quantity: 1,
        });
      }
    },

    removeFromCart: (state, action) => {
      const index = state.items.findIndex(
        (item) => item._id === action.payload,
      );

      if (index !== -1) {
        if (state.items[index].quantity > 1) {
          state.items[index].quantity -= 1;
        } else {
          state.items.splice(index, 1);
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCart, addToCart, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
