import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import sharp from 'sharp';
import { ensureFoodImagesBucket } from '@/lib/supabaseStorage';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/gif',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const BUCKET_NAME = 'food-images';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Ensure the storage bucket exists
    await ensureFoodImagesBucket();

    // Parse multipart form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: 'Invalid form data. Please send multipart/form-data.' },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Please include a "file" field in the form data.' },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type: "${file.type}". Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}.`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed size is 10MB.`,
        },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Resize image using sharp
    let resizedBuffer: Buffer;
    try {
      resizedBuffer = await sharp(buffer)
        .resize({
          width: 1024,
          height: 1024,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFormat('jpeg', { quality: 85 })
        .toBuffer();
    } catch (sharpError) {
      return NextResponse.json(
        {
          error: 'Failed to process image. The file may be corrupted or in an unsupported format.',
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileName = `${crypto.randomUUID()}.jpg`;

    // Create Supabase client with user's auth context
    const supabase = createRouteHandlerClient({ cookies });

    // Get authenticated user (optional — allow anonymous uploads but track user_id if available)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, resizedBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (storageError) {
      console.error('Storage upload error:', storageError);
      return NextResponse.json(
        { error: `Failed to upload image to storage: ${storageError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    // Save metadata to food_images table
    const { data: insertedRecord, error: dbError } = await supabase
      .from('food_images')
      .insert({
        user_id: user?.id ?? null,
        storage_path: fileName,
        public_url: publicUrl,
        original_filename: file.name,
        file_size_bytes: resizedBuffer.length,
        mime_type: 'image/jpeg',
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Attempt to clean up the uploaded file
      await supabase.storage.from(BUCKET_NAME).remove([fileName]);
      return NextResponse.json(
        { error: `Failed to save image metadata: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        url: publicUrl,
        imageId: insertedRecord?.id ?? null,
        fileName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload route unexpected error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred during upload. Please try again.',
      },
      { status: 500 }
    );
  }
}
