// frontend/src/components/EditServiceModal.jsx
import { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { apiCall } from '../utils/api';
import { toast } from 'sonner';

const EditServiceModal = ({ isOpen, onClose, onSuccess, service }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [serviceForm, setServiceForm] = useState({
        name: '',
        price: '',
        duration: '',
        description: ''
    });

    useEffect(() => {
        if (service) {
            setServiceForm({
                name: service.name || '',
                price: service.price || '',
                duration: service.duration || '',
                description: service.description || ''
            });
        }
    }, [service]);

    const handleChange = (e) => {
        setServiceForm({
            ...serviceForm,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await apiCall('PUT', `/services/${service.service_id}`, {
                data: serviceForm,
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Service updated successfully!');
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update service');
            toast.error(err.message || 'Failed to update service');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await apiCall('DELETE', `/services/${service.service_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Service deleted successfully!');
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to delete service');
            toast.error(err.message || 'Failed to delete service');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content premium-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-title-group">
                        <h2>Edit Service</h2>
                        <p className="subtitle">Manage your service details and pricing</p>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="premium-form">
                    <div className="modal-body">
                        <div className="form-group-premium">
                            <label>Service Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g., Signature Haircut"
                                value={serviceForm.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row-premium">
                            <div className="form-group-premium">
                                <label>Price ($)</label>
                                <div className="input-with-icon">
                                    <span className="input-icon-left">$</span>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        value={serviceForm.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group-premium">
                                <label>Duration (mins)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    placeholder="45"
                                    min="1"
                                    value={serviceForm.duration}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-premium">
                            <label>Description</label>
                            <textarea
                                name="description"
                                placeholder="Briefly describe what's included in this service..."
                                value={serviceForm.description}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>

                        {error && <div className="error-banner">{error}</div>}
                    </div>

                    <div className="modal-footer-premium">
                        <button
                            type="button"
                            className="btn-danger-outline"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            <Trash2 size={18} /> Delete Service
                        </button>
                        <div className="footer-right">
                            <button type="button" className="btn-ghost" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary-premium" disabled={loading}>
                                {loading ? 'Updating...' : <><Save size={18} /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditServiceModal;
