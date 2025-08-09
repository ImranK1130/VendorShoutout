// Client-side Cloudinary upload utility
export interface CloudinaryUploadResult {
  url: string
  public_id: string
}

export async function uploadFileToCloudinary(
  file: File, 
  folder: string, 
  publicId: string,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> {
  try {
    // Get signature from our API
    const signatureResponse = await fetch('/api/cloudinary-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        public_id: publicId,
        folder: folder 
      })
    })
    
    if (!signatureResponse.ok) {
      throw new Error('Failed to get upload signature')
    }
    
    const signatureData = await signatureResponse.json()
    
    // Create form data for Cloudinary upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', signatureData.api_key)
    formData.append('timestamp', signatureData.timestamp.toString())
    formData.append('signature', signatureData.signature)
    formData.append('folder', folder)
    formData.append('public_id', publicId)
    
    // Upload directly to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      throw new Error(`Cloudinary upload failed: ${errorText}`)
    }
    
    const result = await uploadResponse.json()
    
    return {
      url: result.secure_url,
      public_id: result.public_id
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}
