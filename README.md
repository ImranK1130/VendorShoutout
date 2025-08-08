# Mehfil Vendor Shoutout Platform

A professional Next.js application for collecting vendor information and creating social media shoutouts.

## Features

- ✨ Professional vendor submission form
- 📧 Automatic email notifications with attachments
- 📱 Responsive design for all devices
- 🔒 Form validation and error handling
- 📎 File upload support for logos and sample images
- 🎨 Beautiful UI with Mehfil branding

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Email**: Nodemailer with SMTP
- **File Handling**: Built-in Next.js file handling
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Vercel account for deployment

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vendor-shoutout
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
# Copy the example file and update with your values
cp .env.local.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set up environment variables in Vercel dashboard:
   - `SMTP_HOST`: mail.spacemail.com
   - `SMTP_PORT`: 465
   - `SMTP_USER`: info@mehfil.app
   - `SMTP_PASS`: Infomehfil2025!
   - `EMAIL_TO`: imran.khan@mehfil.app

4. Deploy!

## Email Configuration

The application uses the following SMTP settings:
- **Host**: mail.spacemail.com
- **Port**: 465 (SSL)
- **Username**: info@mehfil.app
- **Password**: Infomehfil2025!

Emails are sent to: imran.khan@mehfil.app

## Form Fields

### Required Fields
- Business Name
- Owner Name
- Email Address
- Location
- Services/Products
- Business Description
- Business Logo

### Optional Fields
- Phone Number
- Website
- Social Media Handle
- Sample Images (up to 5 files)

## File Upload Limits

- Business Logo: PNG, JPG, SVG (max 5MB)
- Sample Images: PNG, JPG (max 5MB each, up to 5 files)

## Email Template

When a vendor submits the form, you'll receive a professional HTML email containing:
- All form data organized in sections
- Business logo and sample images as attachments
- Professional styling with Mehfil branding

## Project Structure

```
vendor-shoutout/
├── app/
│   ├── api/
│   │   └── submit-vendor/
│   │       └── route.ts          # API endpoint for form submission
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main form page
├── uploads/                     # File upload directory (created at runtime)
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                  # Vercel deployment config
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support or questions, contact: imran.khan@mehfil.app

## License

© 2024 Mehfil. All rights reserved.
