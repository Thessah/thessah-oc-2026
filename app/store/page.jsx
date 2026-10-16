'use client'

import axios from "axios"

export const dynamic = 'force-dynamic'
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon, UsersIcon, ShoppingCartIcon } from "lucide-react"
import ContactMessagesSeller from "./ContactMessagesSeller.jsx";
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function Dashboard() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'AED'
    const router = useRouter()
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        totalCustomers: 0,
        abandonedCarts: 0,
        ratings: [],
    })
    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.totalProducts, icon: ShoppingBasketIcon },
        { title: 'Total Earnings', value: currency + dashboardData.totalEarnings, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.totalOrders, icon: TagsIcon },
        { title: 'Total Customers', value: dashboardData.totalCustomers, icon: UsersIcon },
        { title: 'Abandoned Carts', value: dashboardData.abandonedCarts, icon: ShoppingCartIcon },
        { title: 'Total Ratings', value: dashboardData.ratings?.length || 0, icon: StarIcon },
    ]

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // Dynamically import Firebase
                const { auth } = await import('@/lib/firebase');
                
                // Set up auth state listener to wait for auth to be ready
                return new Promise((resolve) => {
                    const unsubscribe = auth.onAuthStateChanged(async (user) => {
                        try {
                            if (!user) {
                                console.log('[Dashboard] User not authenticated');
                                setDashboardData({
                                    ratings: [],
                                    totalOrders: 0,
                                    totalEarnings: 0,
                                    totalProducts: 0,
                                    totalCustomers: 0,
                                    abandonedCarts: 0
                                });
                                unsubscribe();
                                resolve();
                                return;
                            }
                            
                            console.log('[Dashboard] User authenticated:', user.uid);
                            
                            try {
                                const callDashboard = async (idToken) => {
                                    console.log('[Dashboard] Token obtained:', idToken.substring(0, 20) + '...');
                                    return axios.get('/api/store/dashboard', {
                                        timeout: 5000,
                                        headers: {
                                            Authorization: `Bearer ${idToken}`
                                        }
                                    });
                                };

                                let token = await user.getIdToken();
                                let response;
                                try {
                                    response = await callDashboard(token);
                                } catch (tokenError) {
                                    // Retry once with a forced refresh if the token was rejected
                                    if (tokenError.response?.status === 401) {
                                        try {
                                            const freshToken = await user.getIdToken(true);
                                            response = await callDashboard(freshToken);
                                        } catch (retryError) {
                                            console.error('[Dashboard] Retry after refresh failed:', retryError.message);
                                            console.error('[Dashboard] Retry error response:', retryError.response?.status, retryError.response?.data);
                                            // Don't throw - just log and continue with empty data
                                            response = null;
                                        }
                                    } else {
                                        throw tokenError;
                                    }
                                }

                                if (response) {
                                    console.log('[Dashboard] API Response:', response.status, response.data);
                                    
                                    if (response.data?.dashboardData) {
                                        console.log('[Dashboard] Setting dashboard data');
                                        setDashboardData(response.data.dashboardData);
                                    } else if (response.data) {
                                        console.log('[Dashboard] Using fallback data:', response.data);
                                    }
                                }
                            } catch (tokenError) {
                                console.error('[Dashboard] Token or API error:', tokenError.message);
                                console.error('[Dashboard] Error response:', tokenError.response?.status, tokenError.response?.data);
                                // Just set defaults without redirecting - dashboard will show empty state
                                setDashboardData({
                                    ratings: [],
                                    totalOrders: 0,
                                    totalEarnings: 0,
                                    totalProducts: 0,
                                    totalCustomers: 0,
                                    abandonedCarts: 0
                                });
                            }
                        } catch (error) {
                            console.error('[Dashboard] Outer catch error:', error.message);
                            setDashboardData({
                                ratings: [],
                                totalOrders: 0,
                                totalEarnings: 0,
                                totalProducts: 0,
                                totalCustomers: 0,
                                abandonedCarts: 0
                            });
                        } finally {
                            unsubscribe();
                            resolve();
                        }
                    });
                });
            } catch (error) {
                console.error('[Dashboard] Firebase import error:', error.message);
                setDashboardData({
                    ratings: [],
                    totalOrders: 0,
                    totalEarnings: 0,
                    totalProducts: 0,
                    totalCustomers: 0,
                    abandonedCarts: 0
                });
            }
        };

        fetchDashboard();
    }, []);

    return (
        <div className=" text-emerald-600 mb-28">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl">Seller <span className="text-emerald-800 font-medium">Dashboard</span></h1>
                <button
                    type="button"
                    onClick={() => router.push('/store/manage-product')}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                    Bulk edit stock & listing
                </button>
            </div>

            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {
                    dashboardCardsData.map((card, index) => (
                        <div key={index} className="flex items-center gap-11 border border-green-200 p-3 px-6 rounded-lg bg-white hover:border-green-300 hover:shadow-md transition-all">
                            <div className="flex flex-col gap-3 text-xs">
                                <p className="text-emerald-700">{card.title}</p>
                                <b className="text-2xl font-medium text-emerald-900">{card.value}</b>
                            </div>
                            <card.icon size={50} className=" w-11 h-11 p-2.5 text-emerald-600 bg-emerald-100 rounded-full" />
                        </div>
                    ))
                }
            </div>

            <h2 className="text-emerald-900 font-semibold">Total Reviews</h2>

            <div className="mt-5">
                {
                    dashboardData.ratings && dashboardData.ratings.length > 0 ? (
                        dashboardData.ratings.map((review, index) => (
                        <div key={index} className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-6 border-b border-green-200 text-sm text-emerald-700 max-w-4xl hover:bg-green-50/30 px-3 py-4 rounded transition">
                            <div>
                                <div className="flex gap-3">
                                    {review.user && (
                                        <Image
                                            src={review.user.image && review.user.image.trim() !== '' ? review.user.image : '/placeholder.png'}
                                            alt={review.user.name ? `${review.user.name} avatar` : 'Customer avatar'}
                                            className="w-10 aspect-square rounded-full border-2 border-green-200"
                                            width={100}
                                            height={100}
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium text-emerald-900">{review.user ? review.user.name : "Unknown User"}</p>
                                        <p className="font-light text-emerald-600">{new Date(review.createdAt).toDateString()}</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-emerald-700 max-w-xs leading-6">{review.review}</p>
                            </div>
                            <div className="flex flex-col justify-between gap-6 sm:items-end">
                                <div className="flex flex-col sm:items-end">
                                    <p className="text-emerald-600">{review.product?.category}</p>
                                    <p className="font-medium text-emerald-900">{review.product?.name}</p>
                                    <div className='flex items-center'>
                                        {Array(5).fill('').map((_, index) => (
                                            <StarIcon key={index} size={17} className='text-transparent mt-0.5' fill={review.rating >= index + 1 ? "#10b981" : "#D1FAE5"} />
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => router.push(`/product/${review.product.slug || review.product._id}`)} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-5 py-2 rounded transition-all font-medium border border-emerald-300">View Product</button>
                            </div>
                        </div>
                    ))
                    ) : (
                        <div className="text-center py-8 text-emerald-400">
                            <p>No reviews yet</p>
                        </div>
                    )
                }
            </div>

            {/* Contact Us Messages Section */}
            <ContactMessagesSeller />
        </div>
    )
}