export const handleSubmit = (e, navigate) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const newBlog = {
    id: Date.now(),
    title: data.get('title'),
    subtitle: data.get('subtitle'),
    content: data.get('content'),
    createdAt: new Date().toISOString(),
   badge: 'New Article',
  };

  // Get existing blogs from localStorage
  const storedBlogs = JSON.parse(localStorage.getItem('userBlogs')) || [];

  // Add the new blog to the array
  const updatedBlogs = [...storedBlogs, newBlog];

  // Save back to localStorage
  localStorage.setItem('userBlogs', JSON.stringify(updatedBlogs));

  alert('Blog saved successfully!');

  navigate('/blog/:id');
};
