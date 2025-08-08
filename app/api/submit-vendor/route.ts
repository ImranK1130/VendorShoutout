import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

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
    const formData = await request.formData()
    
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
    const requiredFields = ['businessName', 'ownerName', 'email', 'phone', 'location', 'services', 'description']
    for (const field of requiredFields) {
      if (!vendorData[field as keyof typeof vendorData]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

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
      return NextResponse.json(
        { error: 'Business logo is required' },
        { status: 400 }
      )
    }

    // Convert files to buffers for email attachments (no file system needed)
    const logoBytes = await businessLogo.arrayBuffer()
    const logoBuffer = Buffer.from(logoBytes)
    
    // Process sample images
    const sampleImageBuffers: { buffer: Buffer; filename: string }[] = []
    for (let i = 0; i < sampleImages.length; i++) {
      const image = sampleImages[i]
      const imageBytes = await image.arrayBuffer()
      const imageBuffer = Buffer.from(imageBytes)
      sampleImageBuffers.push({
        buffer: imageBuffer,
        filename: `sample-image-${i + 1}-${image.name}`
      })
    }

    // Prepare email attachments (using buffers instead of file paths)
    const attachments: any[] = [
      {
        filename: businessLogo.name,
        content: logoBuffer,
        cid: 'businessLogo'
      }
    ]

    // Add sample images as attachments
    sampleImageBuffers.forEach((imageData, index) => {
      attachments.push({
        filename: imageData.filename,
        content: imageData.buffer,
        cid: `sampleImage${index}`
      })
    })

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
            <h2>📎 Attachments</h2>
            <p><strong>Business Logo:</strong> ${businessLogo.name}</p>
            ${sampleImages.length > 0 ? `
              <p><strong>Sample Images:</strong></p>
              <ul>
                ${sampleImages.map((img, index) => `<li>Sample Image ${index + 1}: ${img.name}</li>`).join('')}
              </ul>
            ` : '<p>No sample images provided</p>'}
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

    await transporter.sendMail(mailOptions as any)

    return NextResponse.json(
      { 
        message: 'Submission successful! We will review your information and feature you soon.',
        success: true
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
