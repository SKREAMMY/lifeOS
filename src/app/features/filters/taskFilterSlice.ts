import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {TasksQuery, TaskStatus} from "../../../api/tasks.api";

const initialState: TasksQuery = {
    status: "all",
    search: "",
    sort: "newest"
}

const taskFilterSlice = createSlice({
  name: "taskFilters",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<TaskStatus | "all">)=> {
        state.status = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>)=>{
        state.search = action.payload;
    },
    setSort:(state,action: PayloadAction<TasksQuery["sort"]>)=>{
        state.sort = action.payload;
    },
    resetTasksFilters: ()=> initialState
  },
});

export const {setStatus,setSearch,setSort,resetTasksFilters} = taskFilterSlice.actions;
export default taskFilterSlice.reducer;
