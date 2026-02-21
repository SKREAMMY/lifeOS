import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import uiReducer from "./features/ui/uiSlice";
import taskFiltersReducer from "./features/filters/taskFilterSlice";



export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        taskFilters: taskFiltersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;