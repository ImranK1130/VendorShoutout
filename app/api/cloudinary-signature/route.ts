import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'dbjdnwicp',
  api_key: '497574519579458',
  api_secret: 'gpST84pMl0pSb3h-DUIeSVVRVL4',
})

export async function POST(request: NextRequest) {
  try {
    const { public_id, folder } = await request.json()
    
    const timestamp = Math.round(new Date().getTime() / 1000)
    
    // Create signature for secure upload
    const signature = cloudinary.utils.api_sign_request(
      {
        public_id,
        folder,
        timestamp,
      },
      'gpST84pMl0pSb3h-DUIeSVVRVL4'
    )
    
    return NextResponse.json({
      signature,
      timestamp,
      api_key: '497574519579458',
      cloud_name: 'dbjdnwicp'
    })
  } catch (error) {
    console.error('Signature generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    )
  }
}
