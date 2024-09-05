import Booking from '/src/pages/Booking';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Edit from '/src/pages/Edit';
import Login from '/src/pages/Login';
import SignUp from '/src/pages/SignUp';
import { AuthProvider } from './components/AuthProvider';
import Post from './pages/Post';
import Profile from './pages/Profile';

function App() {
  return (
    <>
      <div>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/post" element={<Post />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
