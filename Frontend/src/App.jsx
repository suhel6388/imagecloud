
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import CreatePost from './pages/CreatePost';
import Home from './pages/home';



const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path='/' element={<h1>Hello World!</h1>} /> */}
         <Route path='/' element={<Home/>} />
          <Route path='/form' element={<CreatePost/>} />
      </Routes>
    </Router>
  );
}


export default App;
