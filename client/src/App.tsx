import { Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
 
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute/>}>
          <Route path="/" element={<Home />} />
          </Route>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {/* <h1 className=" text-sm text-cyan-400">Hello world!</h1> */}
    </>
  );
}

export default App;
