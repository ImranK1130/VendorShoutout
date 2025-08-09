'use client'

import { useState } from 'react'
import Image from 'next/image'

interface FormData {
  businessName: string
  ownerName: string
  email: string
  phone: string
  website: string
  socialHandle: string
  location: string
  services: string
  description: string
  businessLogo: File | null
  sampleImage1: File | null
  sampleImage2: File | null
  sampleImage3: File | null
  sampleImage4: File | null
}

export default function VendorShoutoutForm() {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    website: '',
    socialHandle: '',
    location: '',
    services: '',
    description: '',
    businessLogo: null,
    sampleImage1: null,
    sampleImage2: null,
    sampleImage3: null,
    sampleImage4: null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadProgress, setUploadProgress] = useState<string>('')

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required'
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.services.trim()) newErrors.services = 'Services/Products is required'
    if (!formData.description.trim()) newErrors.description = 'Business description is required'
    if (!formData.businessLogo) newErrors.businessLogo = 'Business logo is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'businessLogo' | 'sampleImage1' | 'sampleImage2' | 'sampleImage3' | 'sampleImage4') => {
    const files = Array.from(e.target.files || [])
    const maxFileSize = 100 * 1024 * 1024 // 100MB in bytes
    
    if (files.length > 0) {
      const file = files[0]
      if (file.size > maxFileSize) {
        setErrors(prev => ({ ...prev, [field]: 'File size must be less than 100MB' }))
        e.target.value = '' // Clear the input
        return
      }
      setFormData(prev => ({ ...prev, [field]: file }))
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setUploadProgress('Preparing files for upload...')

    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'businessLogo' && value) {
          formDataToSend.append('businessLogo', value)
        } else if (key.startsWith('sampleImage') && value) {
          formDataToSend.append(key, value)
        } else if (typeof value === 'string') {
          formDataToSend.append(key, value)
        }
      })

      setUploadProgress('Uploading files to cloud storage...')
      
      const response = await fetch('/api/submit-vendor', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        setSubmitStatus('success')
        // Reset form completely
        setFormData({
          businessName: '',
          ownerName: '',
          email: '',
          phone: '',
          website: '',
          socialHandle: '',
          location: '',
          services: '',
          description: '',
          businessLogo: null,
          sampleImage1: null,
          sampleImage2: null,
          sampleImage3: null,
          sampleImage4: null
        })
        // Clear file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>
        fileInputs.forEach(input => {
          input.value = ''
        })
        // Clear any errors
        setErrors({})
        setUploadProgress('')
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const errorData = await response.json()
        setSubmitStatus('error')
        console.error('Submission failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData
        })
        // Show specific error message if available
        if (errorData?.error) {
          alert(`Submission failed: ${errorData.error}`)
        }
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
      setUploadProgress('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearForm = () => {
    setFormData({
      businessName: '',
      ownerName: '',
      email: '',
      phone: '',
      website: '',
      socialHandle: '',
      location: '',
      services: '',
      description: '',
      businessLogo: null,
      sampleImage1: null,
      sampleImage2: null,
      sampleImage3: null,
      sampleImage4: null
    })
    // Clear file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>
    fileInputs.forEach(input => {
      input.value = ''
    })
    setErrors({})
    setSubmitStatus('idle')
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">
              Mehfil Vendor Shoutout
            </h1>
            <p className="text-xl text-white/90">
              Get featured on Mehfil's social media! Submit your business information and we'll create a professional shoutout post for you.
            </p>
          </div>
          
          <div className="flex justify-center items-center gap-8 text-white/80 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Professional
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Reliable
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              Featured
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          {submitStatus === 'success' && (
            <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 border border-green-400 text-green-800 rounded-lg shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🎉</span>
                <h3 className="font-bold text-lg">Submission Successful!</h3>
              </div>
              <p className="mb-2">Thank you for submitting your business information to Mehfil!</p>
              <p className="text-sm">✅ Your information has been sent to our team</p>
              <p className="text-sm">✅ We'll review your submission and feature you on our social media soon</p>
              <p className="text-sm">✅ You'll be contacted if we need any additional information</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <h3 className="font-semibold">Submission Error</h3>
              <p>There was an error submitting your form. Please try again or contact us directly.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Information Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-mehfil-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                Business Information
              </h2>
              <p className="text-gray-600 mb-6">Please provide your business details below</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Business Name *</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.businessName ? 'border-red-500' : ''}`}
                    placeholder="Mehfil Food Cart, Golden Gate Venue, etc."
                  />
                  {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Owner Name *</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.ownerName ? 'border-red-500' : ''}`}
                    placeholder="John Smith"
                  />
                  {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-mehfil-secondary text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  {/* <label className="form-label">Account Email on Mehfil *</label> */}
                  <label className="form-label">Email *</label> 
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="business@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Online Presence Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-mehfil-accent text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                Online Presence
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Social Media Handle</label>
                  <input
                    type="text"
                    name="socialHandle"
                    value={formData.socialHandle}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="@yourbusiness"
                  />
                </div>
              </div>
            </div>

            {/* Business Details Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                Business Details
              </h2>

              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`form-input ${errors.location ? 'border-red-500' : ''}`}
                    placeholder="Chicago, IL"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Services/Products *</label>
                  <input
                    type="text"
                    name="services"
                    value={formData.services}
                    onChange={handleInputChange}
                    className={`form-input ${errors.services ? 'border-red-500' : ''}`}
                    placeholder="Pakistani Food, Wedding Venue, Catering Services, etc."
                  />
                  {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Business Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`form-input ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Tell us about your business, what makes you unique, and why customers should choose you..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Media Uploads Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">5</span>
                Media Uploads
              </h2>

              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Business Logo *</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'businessLogo')}
                    accept="image/png,image/jpeg,image/svg+xml,image/jpg"
                    className={`form-input ${errors.businessLogo ? 'border-red-500' : ''}`}
                  />
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, or SVG (max 100MB)</p>
                  {errors.businessLogo && <p className="text-red-500 text-sm mt-1">{errors.businessLogo}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Sample Images</label>
                  <p className="text-sm text-gray-600 mb-4">Upload up to 4 images of your work/products (max 100MB each)</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sample Image 1 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Sample Image 1</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'sampleImage1')}
                        accept="image/png,image/jpeg,image/jpg"
                        className={`form-input ${errors.sampleImage1 ? 'border-red-500' : ''}`}
                      />
                      {formData.sampleImage1 && (
                        <p className="text-sm text-green-600">✓ {formData.sampleImage1.name}</p>
                      )}
                      {errors.sampleImage1 && <p className="text-red-500 text-sm">{errors.sampleImage1}</p>}
                    </div>

                    {/* Sample Image 2 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Sample Image 2</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'sampleImage2')}
                        accept="image/png,image/jpeg,image/jpg"
                        className={`form-input ${errors.sampleImage2 ? 'border-red-500' : ''}`}
                      />
                      {formData.sampleImage2 && (
                        <p className="text-sm text-green-600">✓ {formData.sampleImage2.name}</p>
                      )}
                      {errors.sampleImage2 && <p className="text-red-500 text-sm">{errors.sampleImage2}</p>}
                    </div>

                    {/* Sample Image 3 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Sample Image 3</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'sampleImage3')}
                        accept="image/png,image/jpeg,image/jpg"
                        className={`form-input ${errors.sampleImage3 ? 'border-red-500' : ''}`}
                      />
                      {formData.sampleImage3 && (
                        <p className="text-sm text-green-600">✓ {formData.sampleImage3.name}</p>
                      )}
                      {errors.sampleImage3 && <p className="text-red-500 text-sm">{errors.sampleImage3}</p>}
                    </div>

                    {/* Sample Image 4 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Sample Image 4</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'sampleImage4')}
                        accept="image/png,image/jpeg,image/jpg"
                        className={`form-input ${errors.sampleImage4 ? 'border-red-500' : ''}`}
                      />
                      {formData.sampleImage4 && (
                        <p className="text-sm text-green-600">✓ {formData.sampleImage4.name}</p>
                      )}
                      {errors.sampleImage4 && <p className="text-red-500 text-sm">{errors.sampleImage4}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadProgress && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-blue-800 font-medium">{uploadProgress}</p>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary flex-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (uploadProgress || 'Submitting...') : 'Submit for Shoutout'}
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="btn-secondary flex-1"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-white/80">
          <div className="mb-4">
            <h3 className="text-2xl font-bold gradient-text">Mehfil</h3>
          </div>
          <p className="mb-4">
            By submitting this form, you agree to have your business featured on Mehfil's social media platforms.
          </p>
          <div className="text-sm">
            <p>© 2024 Mehfil. All rights reserved.</p>
            <p className="mt-2">Professional vendor shoutout platform</p>
          </div>
        </div>
      </div>
    </div>
  )
}
