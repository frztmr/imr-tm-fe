import type { Dispatch } from "@reduxjs/toolkit";
import Axios from "./axios";
import { login } from "@/store/userSlice";

type KeepLoginOptions = {
    dispatch: Dispatch;          // from useDispatch() in the calling component
    isCancelled: () => boolean;  // true once the component unmounts / effect re-runs
    onDone: () => void;          // called when the check finishes (success or fail)
};

// Check the existing session (cookie) with the backend and restore the user into redux.
export const keepLogin = ({ dispatch, isCancelled, onDone }: KeepLoginOptions) => {
    return Axios.get("/auth/keep_login")
        .then((res) => {
            if (isCancelled()) return;
            if (res.status === 200) {
                dispatch(login(res.data.personal));
            }
        })
        .catch(() => {
            console.log("err at keep_login");
        })
        .finally(() => {
            if (!isCancelled()) onDone();
        });
}
