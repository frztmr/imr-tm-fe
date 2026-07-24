import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'



// import { Provider as ChakraProvider } from "@/components/ui/provider";


// ReactRedux
import { Provider as ReduxProvider } from 'react-redux'
// import { rootStore as store } from './reducer/index.ts'
import store from './store/index.ts'


createRoot(document.getElementById("root")!).render(
    <ReduxProvider store={store}>
        <App />
    </ReduxProvider>
);
