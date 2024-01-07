import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import './Login.css';


const Login = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'Student', 
    language: '',
    subject: '',
    classGrade: '',
  });

  const [isLogin, setIsLogin] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin ? 'https://doubtshare-smlr.onrender.com/user/login' : 'https://doubtshare-smlr.onrender.com/user/register';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
     
        alert(data.message);

      
        if (isLogin) {
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('userType', data.userType);
            sessionStorage.setItem('userId', data.userId);
        
          navigate('/', { replace: true });
        }
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error during operation:', error.message);
    }
  };

  return (
    <div className='logReg'>
      <h2>{isLogin ? 'Login' : 'Register'} Page</h2>
      <form className='logRegForm' onSubmit={handleSubmit}>
        {!isLogin && (
          <>
          
            <label>
              Name:
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>

          </>
        )}
  
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>

        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>

        <label>
          UserType:
          <select name="userType" value={formData.userType} onChange={handleChange}>
            <option value="Student">Student</option>
            <option value="Tutor">Tutor</option>
          </select>
        </label>

        {!isLogin && (
          <>
   
            <label>
              Language:
              <input type="text" name="language" value={formData.language} onChange={handleChange} />
            </label>

            <label>
              Subject:
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} />
            </label>

            <label>
              Class/Grade:
              <input type="text" name="classGrade" value={formData.classGrade} onChange={handleChange} />
            </label>
          </>
        )}

        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>

      <p onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Register here." : 'Already have an account? Login here.'}
      </p>
    </div>
  );
};

export default Login;
