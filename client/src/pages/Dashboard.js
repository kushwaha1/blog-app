import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get('/blogs');
        setBlogs(res.data.blogs);
      } catch (err) {
        setFetchError(err.response?.data?.message || 'Failed to load blogs.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await API.delete(`/blogs/${deleteModal._id}`);
      setBlogs(prev => prev.filter(b => b._id !== deleteModal._id));
      toast.success('Blog deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete blog. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteModal(null);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-top">
        <div className="dashboard-welcome">
          <h1>My Dashboard</h1>
          <p>Manage all your blog posts</p>
        </div>
        <div className="profile-card">
          {user?.profileImage
            ? <img src={user.profileImage} alt="Profile" />
            : <div className="profile-placeholder">👤</div>
          }
          <div className="profile-email">{user?.email}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>📝 Blog Posts ({blogs.length})</h2>
          <Link to="/blogs/new" className="btn btn-primary btn-sm">+ Add New Blog</Link>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : fetchError ? (
          <div className="alert-error">{fetchError}</div>
        ) : blogs.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📄</div>
            <h3>No blogs yet</h3>
            <p>Start writing and share your thoughts with the world.</p>
            <Link to="/blogs/new" className="btn btn-primary">Write a Blog</Link>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog._id}>
                  <td>
                    {blog.image
                      ? <img src={blog.image} className="blog-thumb" alt="" />
                      : <div className="blog-thumb-placeholder">🖼</div>
                    }
                  </td>
                  <td className="blog-title-cell">{blog.title}</td>
                  <td className="blog-desc-cell">{blog.description}</td>
                  <td style={{ color: '#999', fontSize: '0.82rem' }}>
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td>
                    <div className="actions">
                      <Link to={`/blogs/${blog._id}`} className="btn btn-outline btn-sm" title="View">👁</Link>
                      <Link to={`/blogs/${blog._id}/edit`} className="btn btn-outline btn-sm" title="Edit">✏️</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal(blog)} title="Delete">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteModal && (
        <div className="modal-overlay" onClick={() => !deleteLoading && setDeleteModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>⚠️ Delete Blog</h3>
            <p>Are you sure you want to delete "<strong>{deleteModal.title}</strong>"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={() => setDeleteModal(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}