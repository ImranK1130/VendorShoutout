// Client-side Cloudinary upload utility
import imageCompression from 'browser-image-compression'

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
    // Compress image if it's too large for Cloudinary free tier (10MB limit)
    let fileToUpload = file
    const maxFileSize = 9 * 1024 * 1024 // 9MB to be safe (Cloudinary free tier is 10MB)
    
    if (file.size > maxFileSize) {
      console.log(`Compressing ${file.name} from ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      
      const compressionOptions = {
        maxSizeMB: 8, // Target 8MB max
        maxWidthOrHeight: 1920, // Max resolution
        useWebWorker: true,
        fileType: file.type.includes('png') ? 'image/png' : 'image/jpeg',
        initialQuality: 0.8, // Start with 80% quality
      }
      
      try {
        fileToUpload = await imageCompression(file, compressionOptions)
        console.log(`Compressed to ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`)
      } catch (compressionError) {
        console.warn('Compression failed, using original file:', compressionError)
        // If compression fails, still try to upload original file
      }
    }

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
    formData.append('file', fileToUpload) // Use compressed file
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
