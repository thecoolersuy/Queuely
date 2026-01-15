import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import Homepage from './pages/private/HomePage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} /> 
        <Route path ="/login" element={<Login />} />   
        <Route path ="/homepage" element = {<Homepage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
