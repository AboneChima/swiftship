import { useState } from 'react'
import { FiMail, FiSend, FiX, FiPaperclip, FiFile } from 'react-icons/fi'
import axios from '../config/axios'

export default function EmailNotification() {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setError('Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed')
        return
      }
      setAttachment(file)
      setError('')
    }
  }

  const removeAttachment = () => {
    setAttachment(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!recipientEmail || !recipientName || !subject || !message) {
      setError('All fields are required')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('recipientEmail', recipientEmail)
      formData.append('recipientName', recipientName)
      formData.append('subject', subject)
      formData.append('message', message)
      if (attachment) {
        formData.append('attachment', attachment)
      }

      await axios.post('/api/admin/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setSuccess(true)
      setSubject('')
      setMessage('')
      setRecipientEmail('')
      setRecipientName('')
      setAttachment(null)
      
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send email')
    } finally {
      setLoading(false)
    }
  }

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
          {/* Recipient Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Recipient Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter recipient's name"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:border-accent-primary focus:outline-none"
              required
            />
          </div>

          {/* Recipient Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Recipient Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Enter recipient's email address"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:border-accent-primary focus:outline-none"
              required
            />
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
              rows="6"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:border-accent-primary focus:outline-none resize-none"
              required
            />
            <p className="mt-2 text-sm text-gray-400">
              {message.length} characters
            </p>
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Attachment <span className="text-gray-500">(Optional)</span>
            </label>
            
            {!attachment ? (
              <label className="flex items-center justify-center w-full px-4 py-6 bg-dark-bg border-2 border-dashed border-dark-border rounded-lg cursor-pointer hover:border-accent-primary transition">
                <div className="text-center">
                  <FiPaperclip className="mx-auto text-3xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">
                    <span className="text-accent-primary font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Images (JPEG, PNG, GIF, WebP) or PDF (Max 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 bg-dark-bg border border-dark-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-accent-primary/10 p-2 rounded-lg">
                    <FiFile className="text-accent-primary text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{attachment.name}</p>
                    <p className="text-xs text-gray-400">
                      {(attachment.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeAttachment}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <FiX size={20} />
                </button>
              </div>
            )}
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
