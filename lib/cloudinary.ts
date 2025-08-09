import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dbjdnwicp',
  api_key: '497574519579458',
  api_secret: 'gpST84pMl0pSb3h-DUIeSVVRVL4',
})

export default cloudinary

export const uploadToCloudinary = async (
  buffer: Buffer,
  filename: string,
  folder: string = 'vendor-submissions',
  customName?: string
): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const publicId = customName ? `${customName}-${Date.now()}` : `${Date.now()}-${filename.replace(/\.[^/.]+$/, '')}`
    
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: folder,
        public_id: publicId,
        quality: 'auto:good',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          })
        } else {
          reject(new Error('Upload failed'))
        }
      }
    ).end(buffer)
  })
}
