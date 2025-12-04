import { FiSave } from 'react-icons/fi'
import { countries } from '../utils/countries'

export default function PackageForm({ formData, setFormData, onSubmit, editingPackage }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Info */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Tracking Number *</label>
            <input
              type="text"
              value={formData.tracking_number}
              onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Product Name *</label>
            <input
              type="text"
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Weight (kg) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Sender Information */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Sender Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Sender Name *</label>
            <input
              type="text"
              value={formData.sender_name}
              onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Sender Phone *</label>
            <input
              type="tel"
              value={formData.sender_phone}
              onChange={(e) => setFormData({ ...formData, sender_phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Sender ID *</label>
            <input
              type="text"
              value={formData.sender_id}
              onChange={(e) => setFormData({ ...formData, sender_id: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Sender Email *</label>
            <input
              type="email"
              value={formData.sender_email}
              onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Sender Country *</label>
            <select
              value={formData.sender_country}
              onChange={(e) => setFormData({ ...formData, sender_country: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Sender Address *</label>
            <input
              type="text"
              value={formData.sender_location}
              onChange={(e) => setFormData({ ...formData, sender_location: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Receiver Information */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Receiver Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Receiver Name *</label>
            <input
              type="text"
              value={formData.receiver_name}
              onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Receiver Phone *</label>
            <input
              type="tel"
              value={formData.receiver_phone}
              onChange={(e) => setFormData({ ...formData, receiver_phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Receiver Email *</label>
            <input
              type="email"
              value={formData.receiver_email}
              onChange={(e) => setFormData({ ...formData, receiver_email: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Receiver Country *</label>
            <select
              value={formData.receiver_country}
              onChange={(e) => setFormData({ ...formData, receiver_country: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-300 mb-2">Receiver Address *</label>
            <input
              type="text"
              value={formData.receiver_location}
              onChange={(e) => setFormData({ ...formData, receiver_location: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Shipping Details */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Shipping & Costs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Shipping Cost ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.shipping_cost}
              onChange={(e) => setFormData({ ...formData, shipping_cost: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Clearance Cost ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.clearance_cost}
              onChange={(e) => setFormData({ ...formData, clearance_cost: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Collection Date</label>
            <input
              type="date"
              value={formData.collection_date}
              onChange={(e) => setFormData({ ...formData, collection_date: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Collection Time</label>
            <input
              type="time"
              value={formData.collection_time}
              onChange={(e) => setFormData({ ...formData, collection_time: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Delivery Date</label>
            <input
              type="date"
              value={formData.delivery_date}
              onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Arrival Date</label>
            <input
              type="date"
              value={formData.arrival_date}
              onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none text-sm"
              required
            >
              <option value="pending">Pending</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        className="bg-accent-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        <FiSave />
        {editingPackage ? 'Update' : 'Create'} Package
      </button>
    </form>
  )
}
