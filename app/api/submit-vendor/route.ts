import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { uploadToCloudinary } from '@/lib/cloudinary'

// Email configuration using your provided SMTP settings
const transporter = nodemailer.createTransport({
  host: 'mail.spacemail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: 'info@mehfil.app',
    pass: 'Infomehfil2025!'
  }
})

export async function POST(request: NextRequest) {
  try {
    console.log('API Route: Starting form submission processing...')
    const formData = await request.formData()
    console.log('API Route: FormData received successfully')
    
    // Extract form fields
    const vendorData = {
      businessName: formData.get('businessName') as string,
      ownerName: formData.get('ownerName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      website: formData.get('website') as string,
      socialHandle: formData.get('socialHandle') as string,
      location: formData.get('location') as string,
      services: formData.get('services') as string,
      description: formData.get('description') as string
    }

    // Validate required fields
    console.log('API Route: Validating form data...', vendorData)
    const requiredFields = ['businessName', 'ownerName', 'email', 'phone', 'location', 'services', 'description']
    for (const field of requiredFields) {
      if (!vendorData[field as keyof typeof vendorData]) {
        console.log(`API Route: Validation failed - ${field} is missing`)
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }
    console.log('API Route: Validation passed')

    // Handle file uploads
    const businessLogo = formData.get('businessLogo') as File
    const sampleImages: File[] = []
    
    // Get sample images
    let imageIndex = 0
    while (formData.get(`sampleImage${imageIndex}`)) {
      const sampleImage = formData.get(`sampleImage${imageIndex}`) as File
      if (sampleImage) {
        sampleImages.push(sampleImage)
      }
      imageIndex++
    }

    if (!businessLogo) {
      console.log('API Route: Business logo is missing')
      return NextResponse.json(
        { error: 'Business logo is required' },
        { status: 400 }
      )
    }
    console.log('API Route: Processing files...', { logoName: businessLogo.name, logoSize: businessLogo.size, sampleImagesCount: sampleImages.length })

    // Check file sizes (25MB limit)
    const maxFileSize = 25 * 1024 * 1024 // 25MB
    if (businessLogo.size > maxFileSize) {
      console.log('API Route: Business logo too large:', businessLogo.size)
      return NextResponse.json(
        { error: 'Business logo file size must be less than 25MB' },
        { status: 400 }
      )
    }

    // Upload files to Cloudinary with descriptive names
    console.log('API Route: Uploading logo to Cloudinary...')
    const logoBytes = await businessLogo.arrayBuffer()
    const logoBuffer = Buffer.from(logoBytes)
    
    // Create descriptive name: "businessname-logo"
    const logoName = `${vendorData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-logo`
    const logoUpload = await uploadToCloudinary(logoBuffer, businessLogo.name, 'mehfil-vendor-logos', logoName)
    console.log('API Route: Logo uploaded successfully:', logoUpload.url)
    
    // Process sample images and upload to Cloudinary
    console.log('API Route: Uploading sample images to Cloudinary...')
    const sampleImageUploads: { url: string; filename: string }[] = []
    for (let i = 0; i < sampleImages.length; i++) {
      const image = sampleImages[i]
      
      // Check sample image file size
      if (image.size > maxFileSize) {
        console.log(`API Route: Sample image ${i} too large:`, image.size)
        return NextResponse.json(
          { error: `Sample image "${image.name}" file size must be less than 25MB` },
          { status: 400 }
        )
      }
      
      const imageBytes = await image.arrayBuffer()
      const imageBuffer = Buffer.from(imageBytes)
      
      // Create descriptive name: "businessname-sample-1"
      const sampleName = `${vendorData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-sample-${i + 1}`
      const imageUpload = await uploadToCloudinary(imageBuffer, image.name, 'mehfil-vendor-samples', sampleName)
      sampleImageUploads.push({
        url: imageUpload.url,
        filename: `${vendorData.businessName} - Sample ${i + 1}`
      })
    }
    console.log('API Route: Sample images uploaded successfully')

    // No email attachments needed - we'll include URLs in the email instead
    const attachments: any[] = []

    // Create email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Vendor Shoutout Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .field { margin: 10px 0; }
          .label { font-weight: bold; color: #6366f1; }
          .value { margin-left: 10px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 New Vendor Shoutout Submission</h1>
          <p>A new business has submitted their information for a shoutout feature</p>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>📋 Business Information</h2>
            <div class="field">
              <span class="label">Business Name:</span>
              <span class="value">${vendorData.businessName}</span>
            </div>
            <div class="field">
              <span class="label">Owner Name:</span>
              <span class="value">${vendorData.ownerName}</span>
            </div>
          </div>

          <div class="section">
            <h2>📞 Contact Information</h2>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${vendorData.email}</span>
            </div>
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value">${vendorData.phone || 'Not provided'}</span>
            </div>
          </div>

          <div class="section">
            <h2>🌐 Online Presence</h2>
            <div class="field">
              <span class="label">Website:</span>
              <span class="value">${vendorData.website || 'Not provided'}</span>
            </div>
            <div class="field">
              <span class="label">Social Handle:</span>
              <span class="value">${vendorData.socialHandle || 'Not provided'}</span>
            </div>
          </div>

          <div class="section">
            <h2>🏢 Business Details</h2>
            <div class="field">
              <span class="label">Location:</span>
              <span class="value">${vendorData.location}</span>
            </div>
            <div class="field">
              <span class="label">Services/Products:</span>
              <span class="value">${vendorData.services}</span>
            </div>
            <div class="field">
              <span class="label">Description:</span>
              <div style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                ${vendorData.description}
              </div>
            </div>
          </div>

          <div class="section">
            <h2>📎 Media Files (Stored in Cloudinary)</h2>
            <div style="margin-bottom: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #6366f1;">
              <p><strong>🏢 Business Logo:</strong></p>
              <p style="margin: 5px 0;"><strong>File name in Cloudinary:</strong> <code>${logoName}</code></p>
              <img src="${logoUpload.url}" alt="Business Logo" style="max-width: 150px; max-height: 150px; border-radius: 8px; margin: 10px 0; border: 2px solid #e5e7eb;">
              <br><a href="${logoUpload.url}" target="_blank" style="color: #6366f1; text-decoration: none; font-weight: bold;">🔗 View/Download Full Size Logo</a>
            </div>
            ${sampleImageUploads.length > 0 ? `
              <div style="margin-top: 20px;">
                <p><strong>📸 Sample Images:</strong></p>
                ${sampleImageUploads.map((img, index) => `
                  <div style="margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 5px 0; font-weight: bold;">${img.filename}</p>
                    <p style="margin: 5px 0; font-size: 12px; color: #6b7280;"><strong>File name in Cloudinary:</strong> <code>${vendorData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-sample-${index + 1}</code></p>
                    <img src="${img.url}" alt="${img.filename}" style="max-width: 150px; max-height: 150px; border-radius: 8px; margin: 10px 0; border: 2px solid #e5e7eb;">
                    <br><a href="${img.url}" target="_blank" style="color: #6366f1; text-decoration: none; font-weight: bold;">🔗 View/Download Full Size</a>
                  </div>
                `).join('')}
              </div>
            ` : '<p style="color: #6b7280; font-style: italic;">No sample images provided</p>'}
            
            <div style="margin-top: 20px; padding: 15px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
              <p style="margin: 0; color: #065f46;"><strong>💡 All images are stored in your Cloudinary account with descriptive names for easy identification!</strong></p>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This submission was received through the Mehfil Vendor Shoutout form.</p>
          <p>Please review the information and attachments to create the shoutout post.</p>
        </div>
      </body>
      </html>
    `

    // Send email
    const mailOptions = {
      from: 'info@mehfil.app',
      to: 'imran.khan@mehfil.app',
      subject: `🎯 New Vendor Shoutout Submission: ${vendorData.businessName}`,
      html: emailHtml,
      attachments: attachments
    }

    console.log('API Route: Sending email...')
    await transporter.sendMail(mailOptions as any)
    console.log('API Route: Email sent successfully')

    return NextResponse.json(
      { 
        message: 'Submission successful! We will review your information and feature you soon.',
        success: true,
        logoUrl: logoUpload.url,
        sampleImages: sampleImageUploads.map(img => img.url)
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { 
        error: 'There was an error processing your submission. Please try again.',
        success: false
      },
      { status: 500 }
    )
  }
}
