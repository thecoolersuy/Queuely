import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { apiCall } from '../utils/api';
import { toast } from 'sonner';

const ReviewModal = ({ isOpen, onClose, booking, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    if (!isOpen || !booking) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await apiCall('POST', '/reviews', {
                data: {
                    booking_id: booking.booking_id,
                    rating,
                    comment
                },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('Review submitted successfully!');
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Submit review error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                background: 'white', padding: '30px', borderRadius: '16px',
                width: '100%', maxWidth: '500px', position: 'relative'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'none', border: 'none', cursor: 'pointer'
                }}>
                    <X size={24} />
                </button>

                <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '24px', fontWeight: 700 }}>Leave a Review</h2>

                <p style={{ color: '#666', marginBottom: '24px' }}>
                    How was your experience with <strong>{booking.barber}</strong> for <strong>{booking.service}</strong>?
                </p>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        >
                            <Star
                                size={32}
                                fill={(hoverRating || rating) >= star ? '#FFD700' : 'none'}
                                color={(hoverRating || rating) >= star ? '#FFD700' : '#E5E7EB'}
                                strokeWidth={1.5}
                            />
                        </button>
                    ))}
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Comment (Optional)</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us about your experience..."
                        style={{
                            width: '100%', minHeight: '100px', padding: '12px',
                            borderRadius: '8px', border: '1px solid #E5E7EB',
                            fontFamily: 'inherit', resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button onClick={onClose} style={{
                        padding: '10px 20px', background: 'white', border: '1px solid #E5E7EB',
                        borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                    }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={loading} style={{
                        padding: '10px 20px', background: '#2563eb', color: 'white',
                        border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}>
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
