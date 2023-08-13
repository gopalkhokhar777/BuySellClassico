import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register'
import Protected from './components/Protected';
import Spinner from './components/Spinner';
import { useSelector } from 'react-redux';
import { Profile } from './pages/Profile';
import Admin from './pages/Admin';
import ProductInfo from './pages/ProductInfo';

function App() {
   const {loading} = useSelector(state=>state.loaders)
  return (
    <div>
    {loading && <Spinner/>}  
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Protected><Home/></Protected>}/>
        <Route path='/product/:id' element={<Protected><ProductInfo/></Protected>}/>
        <Route path='/profile' element={<Protected><Profile/></Protected>}/>
        <Route path='/admin' element={<Protected><Admin/></Protected>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
