import { useState } from 'react'
import { FiMail, FiSend, FiX } from 'react-icons/fi'
import axios from '../config/axios'

export default function EmailNotification({ users }) {
  const [selectedUser, setSelectedUser] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedUser || !subject || !message) {
      setError('All fields are required')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await axios.post('/api/admin/send-email', {
        userId: selectedUser,
        subject,
        message
      })
      
      setSuccess(true)
      setSubject('')
      setMessage('')
      setSelectedUser('')
      
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  const selectedUserData = users.find(u => u.id === parseInt(selectedUser))

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-accent-primary/10 p-3 rounded-lg">
          <FiMail className="text-accent-primary text-2xl" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Send Email Notification</h2>
          <p className="text-gray-400 text-sm">Send custom emails to registered users</p>
        </div>
      </div>

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>✓ Email sent successfully!</span>
          <button onClick={() => setSuccess(false)} className="text-green-400 hover:text-green-300">
            <FiX />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
            <FiX />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 sm:space-y-6">
          {/* User Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Select User <span className="text-red-400">*</span>
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-accent-primary focus:outline-none"
              required
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {selectedUserData && (
              <p className="mt-2 text-sm text-gray-400">
                Email will be sent to: <span className="text-accent-primary">{selectedUserData.email}</span>
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:border-accent-primary focus:outline-none"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows="8"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:border-accent-primary focus:outline-none resize-none"
              required
            />
            <p className="mt-2 text-sm text-gray-400">
              {message.length} characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-accent-primary hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <FiSend />
                Send Email
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
