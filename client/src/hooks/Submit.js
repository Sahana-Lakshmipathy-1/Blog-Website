export const handleSubmit = (e, navigate) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const newBlog = {
    id: Date.now().toString(), // Always store as string
    title: data.get('title'),
    subtitle: data.get('subtitle'),
    content: data.get('content'),
    createdAt: new Date().toISOString(),
    badge: 'New Article', // auto badge
  };

  const existing = JSON.parse(localStorage.getItem('blogs')) || [];
  const updatedBlogs = [...existing, newBlog];

  localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
  alert("Blog saved successfully!");

  navigate(`/blog/${newBlog.id}`); // redirect correctly
};
