import imagekit from "@/configs/imageKit";

export async function POST(request) {
  try {
    console.log('📥 [Collections Upload] Endpoint called');
    
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      console.error('❌ No image in FormData');
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    console.log('✅ Image received:', image.name, image.size, 'bytes');

    const buffer = Buffer.from(await image.arrayBuffer());

    try {
      console.log('⬆️ Uploading to ImageKit...');
      const response = await imagekit.upload({
        file: buffer,
        fileName: `collection_${Date.now()}_${image.name}`,
        folder: "collections"
      });

      const transformedUrl = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" }
        ]
      });

      console.log('✅ Upload successful:', transformedUrl);
      return Response.json({
        success: true,
        url: transformedUrl
      });
    } catch (ikError) {
      console.error('❌ ImageKit error:', ikError.message);
      throw ikError;
    }
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    return Response.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
