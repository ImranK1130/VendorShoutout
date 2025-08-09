# Cloudinary Setup Instructions

## 🚀 Free Cloud Storage Implementation

This project now uses **Cloudinary** for file uploads, which provides:
- ✅ **Free tier**: 25GB storage, 25GB bandwidth/month
- ✅ **Fast uploads**: Direct cloud storage
- ✅ **Image optimization**: Automatic compression and formats
- ✅ **No Vercel limits**: Bypass 5MB request body limits

## 📋 Setup Steps

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up Free"
3. Create your account (GitHub/Google signup available)

### 2. Get Your Credentials
1. After signup, go to your **Dashboard**
2. Copy these three values:
   - **Cloud Name** (e.g., `dxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### 3. Add Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these three variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 4. Deploy
1. Push your code to GitHub
2. Vercel will auto-deploy with the new cloud storage

## 🎯 What Changed

### Benefits:
- **Large files**: Now supports up to 25MB per file
- **Fast uploads**: Direct to Cloudinary CDN
- **Better emails**: Images displayed inline with links
- **Organized storage**: Files stored in folders (`vendor-logos`, `vendor-samples`)
- **No attachments**: Email is faster, images accessible via URLs

### File Structure in Cloudinary:
```
vendor-logos/
  ├── 1640995200000-company-logo.png
  ├── 1640995300000-restaurant-logo.jpg
  └── ...

vendor-samples/
  ├── 1640995400000-sample-food-1.jpg
  ├── 1640995500000-sample-venue-2.png
  └── ...
```

### Email Changes:
- 📧 **Before**: Large email with file attachments
- 📧 **Now**: Clean email with embedded images and "View Full Size" links

## 🔧 Local Development

For local testing, create `.env.local`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 💰 Cloudinary Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Video**: 500MB storage, 1GB bandwidth

This is more than enough for vendor submissions!

## 🚨 Important Notes

1. **Keep credentials secure**: Never commit API secrets to GitHub
2. **Test first**: Upload a test image to verify setup
3. **Monitor usage**: Check Cloudinary dashboard for usage stats
4. **Backup**: Cloudinary stores files permanently (unless deleted)

## ✅ Verification

After setup, test by:
1. Submitting a vendor form with large images
2. Check email for embedded images
3. Verify files appear in Cloudinary dashboard
4. Confirm no more "submission errors"
