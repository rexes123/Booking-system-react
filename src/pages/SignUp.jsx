import { useState, useContext } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassowrd] = useState('');
  const navigate = useNavigate();


  const handleName = (e)=>{
    setName(e.target.value);
  }

  const handleEmail = (e) => {
    setEmail(e.target.value);
    return null;
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPass = (e) => {
    setConfirmPassowrd(e.target.value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Password do not match');
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get user UID
      const uid = response.user.uid;

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', uid),{
        name: name,
        email: email,
      })

      console.log(`User created with UID: ${uid}`);

      console.log(response.user);
      console.log(`email: ${response.user.email}`);
      console.log(`uid: ${response.user.uid}`);
      alert('Sign up successfully');
    } catch (error) {
      console.error(error.message);
    }
  };

  const navToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="container">
      <h3>Sign Up</h3>
      <form onSubmit={handleSignUp}>
      <div class="mb-3">
          <label for="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            aria-describedby="nameHelp"
            value={name}
            onChange={handleName}
            required
          />
        </div>
        <div class="mb-3">
          <label for="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={email}
            onChange={handleEmail}
            required
          />
        </div>
        <div class="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={handlePassword}
            required
          />
        </div>

        <div class="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={confirmPassword}
            onChange={handleConfirmPass}
            required
          />
        </div>

        <button
          type="submit"
          class="btn btn-outline-primary"
          style={{ marginRight: '10px' }}
        >
          Sign Up
        </button>

        <button
          type="button"
          class="btn btn-outline-secondary"
          onClick={navToLogin}
        >
          login
        </button>
      </form>
    </div>
  );
}
