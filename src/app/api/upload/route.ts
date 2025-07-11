import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'general'
    const productId = formData.get('productId') as string || null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Determine folder based on type
    let folder = 'tecbunny'
    switch (type) {
      case 'logo':
      case 'banner':
      case 'website':
        folder = 'tecbunny/website-portal-media'
        break
      case 'product':
        if (productId) {
          folder = `tecbunny/product-media/${productId}`
        } else {
          folder = 'tecbunny/product-media/general'
        }
        break
      case 'avatar':
      case 'profile':
        folder = 'tecbunny/user-media'
        break
      default:
        folder = 'tecbunny/general'
    }

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary with appropriate transformations based on type
    interface CloudinaryTransformation {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    }
    
    let transformations: CloudinaryTransformation[] = []
    
    switch (type) {
      case 'logo':
        transformations = [
          { width: 400, height: 400, crop: 'limit' },
          { quality: 'auto', format: 'auto' }
        ]
        break
      case 'banner':
        transformations = [
          { width: 1920, height: 800, crop: 'limit' },
          { quality: 'auto', format: 'auto' }
        ]
        break
      case 'product':
        transformations = [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto', format: 'auto' }
        ]
        break
      default:
        transformations = [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto', format: 'auto' }
        ]
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: transformations
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: (uploadResult as { secure_url: string }).secure_url,
      public_id: (uploadResult as { public_id: string }).public_id,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json(
        { error: 'No public ID provided' },
        { status: 400 }
      )
    }

    const result = await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({
      success: result.result === 'ok',
      result,
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
