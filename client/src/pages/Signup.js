import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const form = e.target;
    const password = form.password.value;
    const confirm = form.confirmPassword.value;

    if (!PASSWORD_REGEX.test(password)) {
      return setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
    }

    if (password !== confirm) {
      return setError('Passwords do not match.');
    }

    const data = new FormData(form);
    setLoading(true);
    try {
      await signup(data);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Blog<span className="accent">App</span></h1>
          <p>Create your account</p>
        </div>
        <div className="auth-body">
          {error && <div className="alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-input" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-input" placeholder="Min 8 characters" required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input name="confirmPassword" type="password" className="form-input" placeholder="Repeat password" required />
            </div>
            <div className="form-group">
              <label className="form-label">Profile Image</label>
              <input name="profileImage" type="file" className="form-input" accept="image/*" />
              <div className="form-hint">JPG, PNG or WEBP (max 5MB)</div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}