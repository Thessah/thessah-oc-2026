
'use client'

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Counter from "@/components/Counter";
import CartSummaryBox from "@/components/CartSummaryBox";
import ProductCard from "@/components/ProductCard";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { PackageIcon, ShoppingCart, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { fetchShippingSettings, calculateShipping } from '@/lib/shipping';
import { jewelleryUnitPrice } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'AED';
    // TODO: Integrate Firebase Auth for user and token if needed
    const getToken = async () => null;
    const isSignedIn = false;

    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);        

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [shippingSetting, setShippingSetting] = useState(null);
    const [shippingFee, setShippingFee] = useState(0);
    const [liveRates, setLiveRates] = useState(null);
    const [pricedById, setPricedById] = useState({});

    const createCartArray = () => {
        const cartArray = [];
        const invalidKeys = [];
        let nextTotal = 0;
        
        for (const [key, value] of Object.entries(cartItems)) {       
            const product = products.find(product => String(product._id) === String(key));
            if (product) {
                const detail = pricedById[String(key)] || {};
                const source = { ...product, ...detail };
                const unitPrice = jewelleryUnitPrice(source, liveRates);
                cartArray.push({
                    ...source,
                    price: unitPrice,
                    quantity: value,
                });
                nextTotal += unitPrice * value;
            } else {
                invalidKeys.push(key);
            }
        }
        setTotalPrice(nextTotal);
        
        // Clean up invalid cart items (old product.id references)
        if (invalidKeys.length > 0) {
            console.log('Cleaning up invalid cart items:', invalidKeys);
            invalidKeys.forEach(key => {
                dispatch(deleteItemFromCart({ productId: key }));
            });
        }
        
        console.log('Final Cart Array:', cartArray);
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    const fetchRecentOrders = async () => {
        if (!isSignedIn) {
            setLoadingOrders(false);
            return;
        }
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Get unique products from recent orders (limit to last 8 products)                                                                        const recentProducts = [];
            const seenProductIds = new Set();

            if (data.orders && data.orders.length > 0) {
                for (const order of data.orders) {
                    for (const item of order.orderItems) {
                        if (!seenProductIds.has(item.product._id) && recentProducts.length < 8) {                                                                        seenProductIds.add(item.product._id);      
                            recentProducts.push(item.product);        
                        }
                    }
                    if (recentProducts.length >= 8) break;
                }
            }

            setRecentOrders(recentProducts);
        } catch (error) {
            console.error('Failed to fetch recent orders:', error);   
        } finally {
            setLoadingOrders(false);
        }
    }

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts({}));
        }
    }, [dispatch, products.length]);

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products, liveRates, pricedById]);

    useEffect(() => {
        let active = true;
        fetch('/api/gold-rate')
            .then((res) => res.json())
            .then((data) => {
                if (active) setLiveRates(data?.rates || null);
            })
            .catch(() => {});
        return () => { active = false; };
    }, []);

    useEffect(() => {
        const ids = Object.keys(cartItems || {});
        if (ids.length === 0) return;
        let active = true;
        fetch('/api/products/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds: ids }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!active) return;
                const next = {};
                for (const product of data.products || []) {
                    next[String(product._id)] = product;
                }
                setPricedById(next);
            })
            .catch(() => {});
        return () => { active = false; };
    }, [cartItems]);

    useEffect(() => {
        async function loadShipping() {
            const setting = await fetchShippingSettings();
            setShippingSetting(setting);
        }
        loadShipping();
    }, []);

    useEffect(() => {
        if (shippingSetting && cartArray.length > 0) {
            setShippingFee(calculateShipping({ cartItems: cartArray, shippingSetting }));
        } else {
            setShippingFee(0);
        }
    }, [shippingSetting, cartArray]);

    useEffect(() => {
        fetchRecentOrders();
    }, [isSignedIn]);

    return (
        <div className="min-h-[70vh] bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_42%)]">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {cartArray.length > 0 ? (
                    <>
                        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a67c36]">
                                    Your Jewellery Bag
                                </p>
                                <h1 className="mt-1 text-2xl font-semibold text-[#2f2418] sm:text-3xl">
                                    Shopping Cart
                                </h1>
                                <p className="mt-1 text-sm text-[#7a6650]">
                                    {cartArray.length} selected piece{cartArray.length === 1 ? "" : "s"} ready for checkout
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#e7d7be] bg-white/90 px-4 py-3 min-w-[140px]">
                                <p className="text-xs text-[#8a7457]">Bag Total</p>
                                <p className="text-xl font-semibold text-[#2f2418]">
                                    {currency} {(totalPrice + shippingFee).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
                            <div className="space-y-4">
                                {cartArray.map((item) => {
                                    const imageSrc = Array.isArray(item.images) && item.images[0]
                                        ? item.images[0]
                                        : "https://ik.imagekit.io/jrstupuke/placeholder.png";
                                    const unitPrice = jewelleryUnitPrice(item, liveRates);
                                    const lineTotal = unitPrice * (item.quantity || 0);

                                    return (
                                        <article
                                            key={item._id}
                                            className="relative rounded-2xl border border-[#efe2cf] bg-gradient-to-r from-white to-[#fffbf4] px-4 py-4 shadow-[0_14px_32px_-28px_rgba(86,54,19,0.5)]"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteItemFromCart(item._id)}
                                                className="absolute right-3.5 top-3.5 text-[#c4b08d] transition-colors hover:text-[#8a3b2a]"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <Trash2Icon size={18} strokeWidth={1.75} />
                                            </button>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pr-8">
                                                <div className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-xl border border-[#eddcc3] bg-white">
                                                    <Image
                                                        src={imageSrc}
                                                        alt={item.name}
                                                        width={84}
                                                        height={84}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>

                                                <div className="min-w-[150px] flex-1">
                                                    <h3 className="truncate text-sm font-semibold text-[#2f2418] sm:text-base">
                                                        {item.name}
                                                    </h3>
                                                    {item.category ? (
                                                        <p className="mt-0.5 text-xs uppercase tracking-[0.12em] text-[#8a7457]">
                                                            {item.category}
                                                        </p>
                                                    ) : null}
                                                    <p className="mt-1.5 text-sm font-semibold text-[#b8873a]">
                                                        {currency} {unitPrice.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="ml-auto flex shrink-0 items-center gap-4">
                                                    <Counter productId={item._id} />
                                                    <p className="min-w-[4.75rem] text-right text-sm font-semibold text-[#2f2418]">
                                                        {currency} {lineTotal.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <div className="w-full">
                                <div className="lg:sticky lg:top-6">
                                    <CartSummaryBox
                                        subtotal={totalPrice}
                                        shipping={shippingFee}
                                        total={totalPrice + shippingFee}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex min-h-[42vh] items-center justify-center py-6 pb-28 lg:min-h-[50vh] lg:py-10">
                        <div className="w-full max-w-xl rounded-3xl border border-[#ecdfcb] bg-gradient-to-b from-[#fffdf8] to-[#fbf4e8] px-6 py-10 text-center shadow-[0_20px_50px_-34px_rgba(86,54,19,0.45)] sm:px-8 sm:py-14">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#e8d8bf] bg-white sm:mb-5 sm:h-20 sm:w-20">
                                <ShoppingCart size={30} className="text-[#d0b890]" strokeWidth={1.5} />
                            </div>
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a67c36]">
                                Your Jewellery Bag
                            </p>
                            <h1 className="text-2xl font-semibold text-[#362717]">Your cart is empty</h1>
                            <p className="mx-auto mt-2 max-w-sm text-sm text-[#7f6a4f]">
                                Discover timeless pieces and add them here when you find something you love.
                            </p>
                            <a
                                href="/products"
                                className="mt-6 inline-block rounded-xl bg-[#b8873a] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#9b722f]"
                            >
                                Explore Collection
                            </a>
                        </div>
                    </div>
                )}

                {/* Recently Ordered Products Section */}
                {isSignedIn && !loadingOrders && recentOrders.length > 0 && (                                                                                   <div className="mt-16 mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <PackageIcon className="text-slate-700" size={28} />                                                                                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Recently Ordered</h2>                                                     </div>
                        <p className="text-slate-500 mb-6">Products from your recent orders</p>                                             
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">                                                           {recentOrders.map((product) => (
                                <ProductCard key={product._id} product={product} />                                                                                      ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}