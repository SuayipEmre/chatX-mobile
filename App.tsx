import { Provider } from 'react-redux';
import './global.css'
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/store/app/store';

export default function App() {
  return <Provider store={store}>
    <RootNavigator />
  </Provider>
}

