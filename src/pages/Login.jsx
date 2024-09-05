import { useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const auth = getAuth();

  const user = localStorage.getItem('user')

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/post');
    }
  }, [user, navigate]);

  console.log(email);
  console.log(password);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;

    
      localStorage.setItem(
        'user',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
        })
      );

      console.log(`email: ${response.user.email}`);
      console.log(`uid: ${response.user.uid}`);
      navigate('/post');
    } catch (error) {
      console.log(error.message);
    }
  };

  const navToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="container">
      <h3>Login</h3>
      <form>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            Email address
          </label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={email}
            onChange={handleEmail}
          />
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">
            Password
          </label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={handlePassword}
          />
        </div>
  
        <button
          type="button"
          class="btn btn-outline-primary"
          onClick={handleLogin}
          style={{ marginRight: '10px' }}
        >
          Login
        </button>

        <button
          type="button"
          class="btn btn-outline-secondary"
          onClick={navToSignUp}
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
