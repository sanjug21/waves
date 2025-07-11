
import { useDispatch, useSelector, useStore,  } from 'react-redux';
import type {RootState, AppDispatch} from "./store";

export const useAppDispatch=useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
// If you want to type the store, use the AppStore type (import it from your store file if needed):
// import type { AppStore } from "./store";
// export const useAppStore = useStore<AppStore>();

// Or, if you don't need to type it, just use:
export const useAppStore = useStore();