import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!isEdit) return;

    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        const data = res.data.blog;
        setBlog(data);
        setTitle(data.title);
        setDescription(data.description);
      } catch (err) {
        setFetchError(err.response?.data?.message || 'Failed to load blog.');
      }
    };

    fetchBlog();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error('Title is required.');
    if (!description.trim()) return toast.error('Description is required.');

    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('description', description.trim());
    if (image) fd.append('image', image);

    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/blogs/${id}`, fd);
        toast.success('Blog updated successfully!');
      } else {
        await API.post('/blogs', fd);
        toast.success('Blog published successfully!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isEdit && fetchError) {
    return (
      <div className="container">
        <div className="form-page">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <div className="alert-error">{fetchError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-page">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1 style={{ marginBottom: '1.5rem' }}>{isEdit ? 'Edit Blog' : 'Create New Blog'}</h1>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Blog Title *</label>
              <input
                className="form-input"
                placeholder="Enter an engaging title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Blog Image</label>
              {isEdit && blog?.image && !image && (
                <div className="current-image">
                  <img src={blog.image} alt="Current" />
                  <div className="form-hint">Current image. Upload new to replace.</div>
                </div>
              )}
              <input
                type="file"
                className="form-input"
                accept="image/*"
                onChange={e => setImage(e.target.files[0])}
                style={{ marginTop: isEdit && blog?.image ? '0.5rem' : 0 }}
              />
              <div className="form-hint">JPG, PNG, WEBP (max 5MB)</div>
            </div>
            <div className="form-group">
              <label className="form-label">Blog Description *</label>
              <textarea
                className="form-input textarea"
                placeholder="Write your blog content here..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={8}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? '✓ Update Blog' : '+ Publish Blog'}
              </button>
              <Link to="/dashboard" className="btn btn-outline btn-lg">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}