import { ensureImageKit } from '@/configs/imageKit';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return Response.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    try {
      const imagekit = ensureImageKit();
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `banner-${Date.now()}-${file.name}`.replace(/\s+/g, '-');
      
      const result = await imagekit.upload({
        file: buffer,
        fileName: fileName,
        folder: '/banner-uploads'
      });

      console.log('Image uploaded successfully:', result.url);
      return Response.json({ 
        success: true, 
        url: result.url,
        fileId: result.fileId
      });
    } catch (imageKitError) {
      console.error('ImageKit upload error:', imageKitError.message);
      return Response.json({ 
        success: false, 
        error: 'ImageKit upload failed: ' + imageKitError.message 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Image upload error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
