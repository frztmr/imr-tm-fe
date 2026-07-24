import { Action } from "@radix-ui/react-toast";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { string } from "zod";
import { TransactionState } from "@/types/inventory";

const initialState: TransactionState = {
  transaction: [
    {
      product_sku: "",
      product_name: "",
      product_code: 0,
      container_number: "",
      expired_date: "",
      batch_code: "",
      qty: 0,
      pack: 0,
      remarks: " ",
      matcode: 0,
      cust_id: 0,
    },
  ],

  warehouse: {
    po_number: "",
    cust_id: 33010001,
    wh_id: 0,
    location_id: 0,
    wh_name: "",
    trans_type_id: 0,
    trans_type_name: "",
    invoice_id: "",
  },

  transferInventory: false,
  shouldReset: false, // untuk mereset form ketika previous dari SecondPageInput
};
 
const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addInventory: (
      state,
      action: PayloadAction<TransactionState["transaction"]>
    ) => {
      state.transaction = [...action.payload];
    }, 
    clearInventory: (state) => {
      state.transaction = initialState.transaction;
    }, 
    setShouldReset: (state, action: PayloadAction<boolean>) => {
      state.shouldReset = action.payload;
    },
    transferInventory: (
      state,
      // action: PayloadAction<boolean>
    ) => {
      state.transferInventory = true;
    },
    resetTransferInventory: (
      state,
      // action: PayloadAction<boolean>
    ) => {
      state.transferInventory = false;
    },
  },
});

export const {
  addInventory,
  clearInventory, 
  setShouldReset,
  transferInventory,
  resetTransferInventory 
} = inventorySlice.actions;
export default inventorySlice.reducer;

/*
 

*/
