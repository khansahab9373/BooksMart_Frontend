import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      // action.payload is array of {book, quantity}
      state.items = action.payload.map((item) => ({
        ...item.book,
        quantity: item.quantity,
      }));
    },
    addToCart: (state, action) => {
      const existingIndex = state.items.findIndex(
        (item) => item._id === action.payload._id,
      );
      if (existingIndex !== -1) {
        state.items[existingIndex].quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
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
