'use client';

import Link from "next/link";
import { useState } from 'react';
import Button from '../components/button';
import styles from './register.module.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer',  // ✅ Matches your schema default
    skills: []           // ✅ Matches your schema
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle role dropdown
    if (name === 'role') {
      setFormData({ ...formData, role: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // ✅ EXACTLY matches your User schema fields
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,  // Backend hashes it (bcrypt pre-save)
      role: formData.role,          // 'freelancer' or 'client'
      skills: formData.skills || [] // Empty array OK
    };

    try {
      const response = await fetch('http://localhost:4080/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Registration failed');
      }

      // Success ✅
      localStorage.setItem('token', data.token);
      alert(`Welcome ${formData.role === 'freelancer' ? 'Freelancer' : 'Client'}!`);
      window.location.href = '/login';
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
          <label htmlFor="name" className="block mb-2.5 text-sm font-medium text-gray-900">
            Your name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 shadow-sm placeholder:text-gray-500"
            placeholder="John Doe"
            required
          />
        </div>
        
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
            placeholder="john@example.com"
            required
          />
        </div>
        
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-gray-900">
            Your password (min 6 chars)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 shadow-sm placeholder:text-gray-500"
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>

        {/* ✅ Role dropdown - matches your schema enum */}
        <div className="mb-5">
          <label htmlFor="role" className="block mb-2.5 text-sm font-medium text-gray-900">
            Register as
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 shadow-sm"
            required
          >
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>
        </div>

        <div className='mb-5 flex justify-center text-gray-900'>
          <Link href="/login">Login</Link>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="text-center">
          <Button variant="light" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </div>
      </form>
    </div>
  );
}
