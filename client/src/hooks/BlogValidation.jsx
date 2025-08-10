import { useState } from 'react';

const useBlogFormState = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validate required fields and return errors object
  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }
    console.log('Validation errors:', errors);
    return errors;
  };

  // Main submit handler
  const handleSubmit = async (e, navigate, setBlogData) => {
    e.preventDefault();
    console.log('Form submission started');

    setError('');
    setSuccess('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors).join(', ');
      console.log('Validation failed:', errorMessages);
      setError(errorMessages);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      console.log('Token retrieved from localStorage:', token);

      if (!token) {
        setError('Authentication token is missing. Please login.');
        setLoading(false);
        console.warn('No token found, aborting request');
        return;
      }

      const username = localStorage.getItem('username');
      if (!username) {
        setError('Username not found. Please login again.');
        setLoading(false);
        return;
      }

      // Prepare payload with username and badge
      const payload = {
        ...formData,
        username,
        badge: 'New_Article',
      };

      console.log('Submitting payload:', payload);

      const response = await fetch('http://127.0.0.1:2500/api/blogs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Error response body:', errData);
        setError(errData.detail || 'Failed to submit blog.');
      } else {
        const data = await response.json();
        console.log('Blog post created successfully:', data);
        setSuccess('Blog submitted successfully!');
        setFormData({ title: '', subtitle: '', content: '' });

        // Pass full saved blog data to the parent (or wherever) for preview/render
        if (setBlogData) {
          setBlogData(data);
        }

        if (navigate && data.id) {
          console.log('Navigating to blog preview with id:', data.id);
          navigate(`/blog/${data.id}`);
        }
      }
    } catch (err) {
      console.error('Network or unexpected error:', err);
      setError('Network error, please try again.');
    } finally {
      setLoading(false);
      console.log('Form submission ended');
    }
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    success,
    handleSubmit,
  };
};

export default useBlogFormState;
