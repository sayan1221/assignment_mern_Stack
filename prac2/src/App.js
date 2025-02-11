import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Body from './component/Body';
// import ImageSlider from './component/ImageSlider';
import About from './component/About';
import Blog from './component/Blog';
import Login from './component/Login';
import Profile from './component/Profile';
import Navbar from './component/Navbar';
import Search from './component/Search';

function App() {
  return (
    <>
      <div className=''>
        <BrowserRouter>
          <Routes>
          <Route exact path='/Navbar' element={<Navbar/>}></Route>
          {/* <Route exact path='/ImageSlider' element={<ImageSlider/>}></Route> */}
          <Route exact path='/' element={<Body />}></Route>
          <Route exact path='/About' element={<About/>}></Route>
          <Route exact path='/Blog' element={<Blog/>}></Route>
          <Route exact path='/Login' element={<Login/>}></Route>
          <Route exact path='/Profile' element={<Profile/>}></Route>
          <Route exact path='/search' element={<Search/>}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
