import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import addressSlice from "./addressSlice";

export default configureStore({
    reducer: {
        user: userSlice,
        address: addressSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),

});