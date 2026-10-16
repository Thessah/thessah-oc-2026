import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Store from '@/models/Store';

const authSeller = async (userId) => {
    try {
        if (!userId) {
            console.log('[authSeller] No userId provided');
            return false;
        }
        await connectDB();
        
        // Look for store directly by userId (Firebase UID)
        let store = await Store.findOne({ userId: userId }).lean();
        console.log('[authSeller] Store found:', store ? `Yes (${store._id})` : 'No');
        console.log('[authSeller] Store status:', store?.status);
        
        // Allow sellers with pending, approved, or active stores to access the dashboard
        if (store && (store.status === 'approved' || store.status === 'pending' || store.isActive)) {
            return store._id.toString();
        }
        
        // Reject only if store is explicitly rejected
        if (store && store.status === 'rejected') {
            console.log('[authSeller] Store rejected');
            return false;
        }

        // Auto-provision a store for the authorized admin email if none exists
        try {
            const user = await User.findById(userId).lean();
            const allowedEmail = (process.env.NEXT_PUBLIC_STORE_ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'thessahjewellery@gmail.com').toLowerCase();
            if (user?.email && user.email.toLowerCase() === allowedEmail) {
                console.log('[authSeller] No store found for authorized email, creating one...');
                // Ensure unique username based on email local part
                const baseUsername = (allowedEmail.split('@')[0] || 'store').toLowerCase();
                let username = baseUsername;
                let suffix = 0;
                // Try to find a unique username
                // Limit attempts to avoid infinite loop
                // eslint-disable-next-line no-constant-condition
                while (suffix < 10) {
                    const exists = await Store.findOne({ username }).lean();
                    if (!exists) break;
                    suffix += 1;
                    username = `${baseUsername}${suffix}`;
                }

                const newStore = new Store({
                    name: 'Thessah Store',
                    userId,
                    username,
                    email: allowedEmail,
                    isActive: true,
                    status: 'approved'
                });
                const saved = await newStore.save();
                console.log('[authSeller] Store created:', saved._id.toString());
                return saved._id.toString();
            }
        } catch (provisionErr) {
            console.log('[authSeller] Auto-provision error:', provisionErr?.message);
        }

        return false;
    } catch (error) {
        console.log('[authSeller] Error:', error);
        return false;
    }
}

export default authSeller