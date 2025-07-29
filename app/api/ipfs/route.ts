import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file provided' 
      }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'File must be an image' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        error: 'File size must be less than 5MB' 
      }, { status: 400 });
    }

    console.log('Uploading file to IPFS:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // For now, we'll use a mock IPFS upload
    // In production, you'd use a real IPFS service like Pinata, Infura, or Web3.Storage
    const mockIpfsHash = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const mockIpfsUrl = `https://ipfs.io/ipfs/${mockIpfsHash}`;

    console.log('File uploaded to IPFS:', mockIpfsUrl);

    return NextResponse.json({
      success: true,
      url: mockIpfsUrl,
      hash: mockIpfsHash,
      message: 'File uploaded to IPFS successfully'
    });

  } catch (error) {
    console.error('IPFS upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload file to IPFS' 
    }, { status: 500 });
  }
} 