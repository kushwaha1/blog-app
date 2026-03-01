import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Avatar({ user, size = 34 }) {
  const style = { width: size, height: size, borderRadius: '50%', objectFit: 'cover' };
  if (user?.profileImage)
    return <img src={user.profileImage} alt="" style={style} />;
  return <div className="comment-avatar-placeholder" style={{ width: size, height: size }}>👤</div>;
}

export default function BlogView() {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState({});
  const [showReply, setShowReply] = useState({});
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState({});

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        setBlog(res.data.blog);
      } catch (err) {
        setFetchError(err.response?.data?.message || 'Failed to load blog.');
      }
    };

    fetchBlog();
  }, [id]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return toast.error('Comment cannot be empty.');

    setCommentLoading(true);
    try {
      const { data } = await API.post(`/comments/${id}`, { text: commentText.trim() });
      setBlog(prev => ({ ...prev, comments: data.comments }));
      setCommentText('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  };

  const addReply = async (e, commentId) => {
    e.preventDefault();
    const text = replyText[commentId];
    if (!text?.trim()) return toast.error('Reply cannot be empty.');

    setReplyLoading(prev => ({ ...prev, [commentId]: true }));
    try {
      const { data } = await API.post(`/comments/${id}/${commentId}/reply`, { text: text.trim() });
      setBlog(prev => ({ ...prev, comments: data.comments }));
      setReplyText(prev => ({ ...prev, [commentId]: '' }));
      setShowReply(prev => ({ ...prev, [commentId]: false }));
      toast.success('Reply added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add reply. Please try again.');
    } finally {
      setReplyLoading(prev => ({ ...prev, [commentId]: false }));
    }
  };

  if (fetchError) {
    return (
      <div className="container">
        <div className="blog-view">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <div className="alert-error">{fetchError}</div>
        </div>
      </div>
    );
  }

  if (!blog) return <div className="spinner" />;

  return (
    <div className="container">
      <div className="blog-view">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>

        {blog.image && (
          <img src={blog.image} className="blog-hero-img" alt={blog.title} />
        )}

        <h1 style={{ fontSize: '2.4rem', marginBottom: '1.5rem' }}>{blog.title}</h1>

        <div className="blog-meta">
          <Avatar user={blog.author} size={44} />
          <div className="author-info">
            <div className="name">{blog.author?.email}</div>
            <div className="date">
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </div>
          </div>
        </div>

        <div className="blog-body">{blog.description}</div>

        <div className="comments-section">
          <h2>💬 Comments ({blog.comments?.length || 0})</h2>

          <form className="comment-form" onSubmit={addComment}>
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit" className="btn btn-primary" disabled={commentLoading}>
              {commentLoading ? 'Posting...' : 'Post'}
            </button>
          </form>

          {blog.comments?.length === 0 && (
            <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
              No comments yet. Be the first!
            </p>
          )}

          {[...(blog.comments || [])].reverse().map(comment => (
            <div className="comment-card" key={comment._id}>
              <div className="comment-header">
                <Avatar user={comment.user} size={34} />
                <div>
                  <div className="comment-user">{comment.user?.email || 'Unknown'}</div>
                  <div className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <p className="comment-text">{comment.text}</p>

              {comment.replies?.length > 0 && (
                <div className="replies">
                  {comment.replies.map(reply => (
                    <div className="reply-item" key={reply._id}>
                      <div className="reply-header">
                        <Avatar user={reply.user} size={26} />
                        <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{reply.user?.email || 'Unknown'}</span>
                        <span style={{ color: '#999', fontSize: '0.75rem' }}>{new Date(reply.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', paddingLeft: '32px' }}>{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="reply-toggle"
                onClick={() => setShowReply(p => ({ ...p, [comment._id]: !p[comment._id] }))}
              >
                ↩ Reply
              </button>

              {showReply[comment._id] && (
                <form className="reply-form" onSubmit={e => addReply(e, comment._id)}>
                  <input
                    value={replyText[comment._id] || ''}
                    onChange={e => setReplyText(p => ({ ...p, [comment._id]: e.target.value }))}
                    placeholder="Write a reply..."
                  />
                  <button
                    type="submit"
                    className="btn btn-outline btn-sm"
                    disabled={replyLoading[comment._id]}
                  >
                    {replyLoading[comment._id] ? 'Replying...' : 'Reply'}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}