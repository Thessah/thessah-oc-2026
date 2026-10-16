import ImageKit from "imagekit";

// Lazy initialize ImageKit to avoid build-time crashes when env vars are missing
let _imagekit = null;

export function ensureImageKit() {
    if (_imagekit) return _imagekit;
    
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
    
    console.log('🔍 ImageKit config check:');
    console.log('  Public Key:', publicKey ? '✓ Found' : '✗ Missing');
    console.log('  Private Key:', privateKey ? '✓ Found' : '✗ Missing');
    console.log('  URL Endpoint:', urlEndpoint ? `✓ ${urlEndpoint}` : '✗ Missing');
    
    if (!publicKey || !privateKey || !urlEndpoint) {
        throw new Error("ImageKit is not configured - missing env variables");
    }
    
    _imagekit = new ImageKit({
        publicKey: publicKey,
        privateKey: privateKey,
        urlEndpoint: urlEndpoint,
    });
    
    console.log('✅ ImageKit initialized successfully');
    return _imagekit;
}

// Default export preserves existing imports; methods resolve to the instance on first use
const imagekit = new Proxy({}, {
    get(_target, prop) {
        const ik = ensureImageKit();
        // @ts-ignore - dynamic property access on ImageKit instance
        return ik[prop];
    }
});

export default imagekit;