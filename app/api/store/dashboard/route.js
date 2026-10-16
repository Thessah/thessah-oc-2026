import dbConnect from "@/lib/mongodb";
import { getAuth } from "firebase-admin/auth";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Rating from "@/models/Rating";
import AbandonedCart from "@/models/AbandonedCart";
import authSeller from "@/middlewares/authSeller";
import { NextResponse } from "next/server";

// Import to ensure Firebase Admin is initialized
import "@/lib/firebase-admin";

// Next.js API route handler for GET
export async function GET(request) {
   try {
      console.log('[DASHBOARD] Request received');
      
      // Get user from Firebase token
      const authHeader = request.headers.get('authorization');
      console.log('[DASHBOARD] Auth header present:', !!authHeader);
      
      let userId = null;
      let userEmail = null;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
         const idToken = authHeader.split('Bearer ')[1];
         console.log('[DASHBOARD] Token extracted, length:', idToken?.length);

         try {
            console.log('[DASHBOARD] Attempting token verification...');
            const auth = getAuth();
            const decodedToken = await auth.verifyIdToken(idToken);
            userId = decodedToken.uid;
            userEmail = decodedToken.email;
            console.log('[DASHBOARD] ✅ Token verified successfully');
            console.log('[DASHBOARD] User:', userEmail);

            // Only allow configured admin email
            const allowedEmail = (process.env.NEXT_PUBLIC_STORE_ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'thessahjewellery@gmail.com').toLowerCase();
            if (userEmail?.toLowerCase() !== allowedEmail) {
               console.error('[DASHBOARD] ❌ Access denied for:', userEmail);
               return NextResponse.json({ 
                  error: `Access denied. Only ${allowedEmail} can access this dashboard.`
               }, { status: 403 });
            }

            console.log('[DASHBOARD] ✅ Access granted');
         } catch (e) {
            console.error('[DASHBOARD] ❌ Token verification failed:', e.message);
            console.error('[DASHBOARD] Error code:', e.code);
            console.error('[DASHBOARD] Full error:', e);
            return NextResponse.json({ 
               error: 'Invalid or expired token. Please sign in again.',
               code: e.code,
               details: e.message
            }, { status: 401 });
         }
      } else {
         console.error('[DASHBOARD] ❌ No valid authorization header');
         return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
      }

      // For thessahjewellery@gmail.com, we'll query all products without storeId restriction
      // This allows the dashboard to work even without a Store record in the database
      let storeId = null;
      
      // If we don't have a userId (shouldn't happen at this point, but safety check)
      if (userId) {
         try {
            storeId = await authSeller(userId);
            console.log('[DASHBOARD] Store ID from authSeller:', storeId);
         } catch (error) {
            console.log('[DASHBOARD] authSeller check failed, continuing without storeId:', error.message);
         }
      }

      try {
         await dbConnect();
      } catch (dbError) {
         console.error('[DASHBOARD] ❌ MongoDB connection failed:', dbError.message);
         // Return empty dashboard instead of failing
         return NextResponse.json({
            dashboardData: {
               ratings: [],
               totalOrders: 0,
               totalEarnings: 0,
               totalProducts: 0,
               totalCustomers: 0,
               abandonedCarts: 0
            },
            error: 'Database connection error'
         }, { status: 200 });
      }
      
      try {
         // Query with or without storeId depending on what's available
         const orderQuery = storeId ? { storeId } : {};
         const productQuery = storeId ? { storeId } : {};
         const cartQuery = storeId ? { storeId } : {};

         console.log('[DASHBOARD] Querying orders with:', orderQuery);
         const orders = await Order.find(orderQuery).lean();

         console.log('[DASHBOARD] Querying products with:', productQuery);
         const products = await Product.find(productQuery).lean();

         const ratings = await Rating.find({
            productId: { $in: products.map(product => product._id.toString()) }
         }).lean();

         // Get unique customers who have ordered
         const uniqueCustomerIds = [...new Set(orders.map(order => order.userId))];
         const totalCustomers = uniqueCustomerIds.length;

         // Get abandoned carts
         const abandonedCarts = await AbandonedCart.countDocuments(cartQuery);

         const dashboardData = {
            ratings,
            totalOrders: orders.length,
            totalEarnings: Math.round(orders.reduce((acc, order) => acc + (order.total || 0), 0)),
            totalProducts: products.length,
            totalCustomers,
            abandonedCarts
         };

         console.log('[DASHBOARD] ✅ Dashboard data:', {
            orders: orders.length,
            products: products.length,
            customers: totalCustomers,
            abandonedCarts
         });

         return NextResponse.json({ dashboardData }, { status: 200 });
      } catch (queryError) {
         console.error('❌ Query error:', queryError.message);
         return NextResponse.json({
            dashboardData: {
               ratings: [],
               totalOrders: 0,
               totalEarnings: 0,
               totalProducts: 0,
               totalCustomers: 0,
               abandonedCarts: 0
            },
            error: 'Query timeout - returning fallback data'
         }, { status: 200 });
      }
   } catch (error) {
      console.error('❌ Dashboard error:', error.message);
      return NextResponse.json({ 
         error: error.message,
         dashboardData: {
            ratings: [],
            totalOrders: 0,
            totalEarnings: 0,
            totalProducts: 0,
            totalCustomers: 0,
            abandonedCarts: 0
         }
      }, { status: 200 });
   }
}