// frontend/src/components/AddServiceBarberModal.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiCall } from '../utils/api';

const AddServiceBarberModal = ({ isOpen, onClose, onSuccess, initialTab = 'service' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'service' or 'barber'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sync activeTab when modal opens or initialTab shifts
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError('');
      setSuccess('');
    }
  }, [isOpen, initialTab]);

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    name: '',
    price: '',
    duration: '',
    description: ''
  });

  // Barber form state
  const [barberForm, setBarberForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: ''
  });

  const handleServiceChange = (e) => {
    setServiceForm({
      ...serviceForm,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleBarberChange = (e) => {
    setBarberForm({
      ...barberForm,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await apiCall('POST', '/services', {
        data: serviceForm,
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Service added successfully!');
      setTimeout(() => {
        setServiceForm({ name: '', price: '', duration: '', description: '' });
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBarber = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await apiCall('POST', '/barbers', {
        data: barberForm,
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Barber added successfully!');
      setTimeout(() => {
        setBarberForm({ name: '', email: '', phone: '', specialization: '', experience: '' });
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to add barber');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Add Service / Barber</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Tabs */}
          <div className="modal-tabs">
            <button
              className={`modal-tab ${activeTab === 'service' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('service');
                setError('');
                setSuccess('');
              }}
            >
              Add Service
            </button>
            <button
              className={`modal-tab ${activeTab === 'barber' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('barber');
                setError('');
                setSuccess('');
              }}
            >
              Add Barber
            </button>
          </div>

          {/* Service Form */}
          {activeTab === 'service' && (
            <form onSubmit={handleSubmitService}>
              <div className="form-group-modal">
                <label className="form-label-modal">Service Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input-modal"
                  placeholder="e.g., Signature Cut"
                  value={serviceForm.name}
                  onChange={handleServiceChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group-modal">
                  <label className="form-label-modal">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input-modal"
                    placeholder="59.00"
                    step="0.01"
                    min="0"
                    value={serviceForm.price}
                    onChange={handleServiceChange}
                    required
                  />
                </div>

                <div className="form-group-modal">
                  <label className="form-label-modal">Duration (minutes) *</label>
                  <input
                    type="number"
                    name="duration"
                    className="form-input-modal"
                    placeholder="45"
                    min="1"
                    value={serviceForm.duration}
                    onChange={handleServiceChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group-modal">
                <label className="form-label-modal">Description</label>
                <textarea
                  name="description"
                  className="form-textarea-modal"
                  placeholder="Describe the service..."
                  value={serviceForm.description}
                  onChange={handleServiceChange}
                />
              </div>

              {error && <p className="error-message-modal">{error}</p>}
              {success && <p className="success-message-modal">{success}</p>}

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          )}

          {/* Barber Form */}
          {activeTab === 'barber' && (
            <form onSubmit={handleSubmitBarber}>
              <div className="form-group-modal">
                <label className="form-label-modal">Barber Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input-modal"
                  placeholder="e.g., John Doe"
                  value={barberForm.name}
                  onChange={handleBarberChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group-modal">
                  <label className="form-label-modal">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input-modal"
                    placeholder="john@example.com"
                    value={barberForm.email}
                    onChange={handleBarberChange}
                  />
                </div>

                <div className="form-group-modal">
                  <label className="form-label-modal">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input-modal"
                    placeholder="+1234567890"
                    value={barberForm.phone}
                    onChange={handleBarberChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-modal">
                  <label className="form-label-modal">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    className="form-input-modal"
                    placeholder="e.g., Fades, Beard Styling"
                    value={barberForm.specialization}
                    onChange={handleBarberChange}
                  />
                </div>

                <div className="form-group-modal">
                  <label className="form-label-modal">Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    className="form-input-modal"
                    placeholder="5"
                    min="0"
                    value={barberForm.experience}
                    onChange={handleBarberChange}
                  />
                </div>
              </div>

              {error && <p className="error-message-modal">{error}</p>}
              {success && <p className="success-message-modal">{success}</p>}

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Barber'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddServiceBarberModal;