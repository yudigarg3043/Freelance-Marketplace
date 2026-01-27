'use client';

import Link from "next/link";
import { useState } from 'react';
import Button from '../components/button';
import styles from './login.module.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={`${styles.form} max-w-sm mx-auto`} onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-gray-900">
            Your email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 shadow-sm placeholder:text-gray-500"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-gray-900">
            Your password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 shadow-sm placeholder:text-gray-500"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className='mb-5 flex justify-center text-gray-900'>
          <Link href="/register">Register</Link>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="text-center">
          <Button variant="light" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  );
}
