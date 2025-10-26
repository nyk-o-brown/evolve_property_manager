import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/properties';

export default function PropertyCreate() {
  const navigate = useNavigate();
  
  const [formValues, setFormValues] = useState({
    property_name: '',
    location: '',
    description: '',
    rent: '',
    price: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5000000) {
        setError('File is too large. Maximum size is 5MB.');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, JPEG, PNG & GIF files are allowed.');
        return;
      }

      setImageFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('property_name', formValues.property_name);
    formData.append('location', formValues.location);
    formData.append('description', formValues.description);
    formData.append('rent', formValues.rent || '');
    formData.append('price', formValues.price || '');
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await fetch(`${API_URL}/create_properties.php`, {
        method: 'POST',
        body: formData // Don't set Content-Type header, browser will set it with boundary
      });

      const contentType = res.headers.get('content-type') || '';
      const result = contentType.includes('application/json') ? await res.json() : null;

      if (!res.ok) {
        const message = result?.message || `Request failed (HTTP ${res.status})`;
        throw new Error(message);
      }

      if (result && result.status === 'success') {
        setSuccess(true);
        // Reset form
        setFormValues({
          property_name: '',
          location: '',
          description: '',
          rent: '',
          price: '',
        });
        setImageFile(null);
        setImagePreview(null);
        
        // Navigate back after a delay
        setTimeout(() => {
          navigate('/dashboard/properties');
        }, 1500);
      } else if (result) {
        throw new Error(result.message || 'Unknown server response');
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/properties');
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/properties');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create New Property</h1>
        <p className="text-gray-600">Add a new property to your portfolio</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Property created successfully! Redirecting...
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Property Name */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Name *
              </label>
              <input
                name="property_name"
                value={formValues.property_name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Sunset Apartments"
                required
              />
            </div>

            {/* Location */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                name="location"
                value={formValues.location}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 123 Main Street, City, State"
              />
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formValues.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the property features, amenities, etc."
              />
            </div>

            {/* Rent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Rent ($)
              </label>
              <input
                name="rent"
                type="number"
                step="0.01"
                min="0"
                value={formValues.rent}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1500.00"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price ($)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formValues.price}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="250000.00"
              />
            </div>

            {/* Image Upload */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Image
              </label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                JPG, JPEG, PNG or GIF. Max 5MB.
              </p>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs max-h-48 rounded border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Property'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}