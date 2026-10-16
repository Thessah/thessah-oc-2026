"use client";
import { useAuth } from "@/lib/useAuth";
import { ShoppingCartIcon, Heart, StarIcon } from 'lucide-react'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
// ...existing code...
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { uploadCart } from '@/lib/features/cart/cartSlice'

import toast from 'react-hot-toast'
import { jewelleryUnitPrice } from '@/lib/pricing'

let goldRatesRequest = null
function loadGoldRates() {
    if (!goldRatesRequest) {
        goldRatesRequest = fetch('/api/gold-rate')
            .then((res) => res.json())
            .then((data) => data?.rates || null)
            .catch(() => null)
    }
    return goldRatesRequest
}

const ProductCard = ({ product, variant = "card" }) => {
    const isEditorial = variant === "editorial";
    const currency = process.env.NEXT_PUBLIC_CURRENCY_LABEL || process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'AED'
    const dispatch = useDispatch()
    const { getToken } = useAuth()
    const cartItems = useSelector(state => state.cart.cartItems)
    const itemQuantity = cartItems[product._id] || 0

    // Review state and fetching logic (lazy-load on hover/focus)
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewsLoaded, setReviewsLoaded] = useState(false);
    const cardRef = useRef(null);

    const fetchReviews = useCallback(async () => {
        if (reviewsLoaded) return;
        setLoadingReviews(true);
        try {
            const { data } = await import('axios').then(ax => ax.default.get(`/api/review?productId=${product._id}`));
            setReviews(data.reviews || []);
            setReviewsLoaded(true);
        } catch (error) {
            // silent fail
        } finally {
            setLoadingReviews(false);
        }
    }, [product._id, reviewsLoaded]);

    // Only fetch reviews on hover or focus
    const handleCardEnter = () => fetchReviews();

    // Calculate rating and count from fetched reviews, fallback to product fields
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviews.length
        : (typeof product.averageRating === 'number' ? product.averageRating : 0);
    const ratingCount = reviews.length > 0
        ? reviews.length
        : (typeof product.ratingCount === 'number' ? product.ratingCount : 0);
    const ratingValue = Math.max(0, Math.min(5, Number(averageRating) || 0));
    const hasReviews = ratingCount > 0;

    // Calculate discount percentage
    const discount = product.AED && product.AED > product.price
        ? Math.round(((product.AED - product.price) / product.AED) * 100)
        : 0

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(addToCart({ productId: product._id }))
        dispatch(uploadCart({ getToken }))
        toast.success('Added to cart')
    }

    const [liveRates, setLiveRates] = useState(null)
    useEffect(() => {
        let active = true
        loadGoldRates().then((rates) => {
            if (active) setLiveRates(rates)
        })
        return () => { active = false }
    }, [])

    const cardPrice = jewelleryUnitPrice(product, liveRates)
    const showCurrentPrice = cardPrice > 0
    const showOriginalPrice = Number(product.price) > 0 && Number(product.AED) > cardPrice
    const showPriceBlock = showCurrentPrice || showOriginalPrice
    const mainImage = product.images && Array.isArray(product.images) && product.images[0] && typeof product.images[0] === 'string' && product.images[0].trim() !== ''
        ? product.images[0]
        : 'https://ik.imagekit.io/jrstupuke/placeholder.png';
    const hoverImage = product.images && Array.isArray(product.images) && product.images[1] && product.images[1].trim() !== ''
        ? product.images[1]
        : '';
    const karatLabel = product.attributes?.goldPurityKarat ? `${product.attributes.goldPurityKarat}K` : '';
    const weightLabel = Number(product.goldWeight) > 0 ? `${Number(product.goldWeight).toFixed(2)} g` : '';
    const pieceMeta = [karatLabel, weightLabel].filter(Boolean).join(' · ');

    if (isEditorial) {
        return (
            <Link href={`/product/${product.slug}`} className="group block h-full">
                <article
                    ref={cardRef}
                    onMouseEnter={handleCardEnter}
                    onFocus={handleCardEnter}
                    tabIndex={0}
                    className="flex h-full flex-col overflow-hidden rounded-md border border-[#e6e6e6] bg-white"
                >
                    <div className="relative aspect-square overflow-hidden bg-white">
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            quality={92}
                            className={`object-contain ${hoverImage ? 'transition duration-500 group-hover:opacity-0' : ''}`}
                            onError={(e) => {
                                if (e.currentTarget.src !== 'https://ik.imagekit.io/jrstupuke/placeholder.png') {
                                    e.currentTarget.src = 'https://ik.imagekit.io/jrstupuke/placeholder.png';
                                }
                            }}
                        />
                        {hoverImage ? (
                            <Image
                                src={hoverImage}
                                alt=""
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                quality={92}
                                className="object-contain opacity-0 transition duration-500 group-hover:opacity-100"
                            />
                        ) : null}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toast.success('Added to wishlist');
                            }}
                            className="absolute right-2 top-2 z-20 p-1 text-[#4a4a4a] transition hover:text-[#832729]"
                            aria-label="Save piece"
                        >
                            <Heart size={20} strokeWidth={1.4} />
                        </button>
                    </div>
                    <div className="flex flex-1 flex-col px-3 pb-3 pt-3 text-left">
                        <h3 className="line-clamp-2 min-h-[2.6em] text-sm font-normal leading-snug text-[#333333]">
                            {product.name}
                        </h3>
                        {pieceMeta ? (
                            <p className="mt-1 text-xs text-[#6b6b6b]">{pieceMeta}</p>
                        ) : null}
                        {showCurrentPrice ? (
                            <p className="mt-1.5 text-[15px] font-semibold text-[#1a1a1a]">
                                {currency} {cardPrice.toLocaleString('en-IN')}
                            </p>
                        ) : null}
                        {hasReviews ? (
                            <div className="mt-1.5 flex items-center gap-1.5" aria-label={`Rating ${ratingValue.toFixed(1)} out of 5 from ${ratingCount} reviews`}>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isFilled = star <= Math.round(ratingValue);
                                        return (
                                            <StarIcon
                                                key={star}
                                                size={13}
                                                className={isFilled ? 'text-[#f5a623]' : 'text-[#e0e0e0]'}
                                                fill={isFilled ? 'currentColor' : 'none'}
                                            />
                                        );
                                    })}
                                </div>
                                <span className="text-xs text-[#6b6b6b]">({ratingCount})</span>
                            </div>
                        ) : null}
                    </div>
                </article>
            </Link>
        );
    }

    return (
        <Link href={`/product/${product.slug}`} className="group w-full block">
            <div
                className={isEditorial
                    ? "flex h-full flex-col bg-transparent"
                    : "flex h-full flex-col overflow-hidden rounded-2xl border border-[#efe2cf] bg-white shadow-[0_14px_32px_-28px_rgba(86,54,19,0.45)] transition hover:-translate-y-0.5 hover:border-[#dec6a1]"
                }
                ref={cardRef}
                onMouseEnter={handleCardEnter}
                onFocus={handleCardEnter}
                tabIndex={0}
            >
                {/* Product Image with hover swap */}
                <div className={isEditorial
                    ? "relative w-full aspect-[4/5] overflow-hidden bg-[#f3eee6]"
                    : "relative w-full aspect-square overflow-hidden bg-[#fffdf8]"
                }>
                    {/* Main image */}
                    <div className={`absolute inset-0 transition-all duration-500 ${
                        product.images && Array.isArray(product.images) && product.images[1] && product.images[1].trim() !== ''
                            ? 'group-hover:opacity-0'
                            : 'group-hover:scale-105'
                    }`}>
                        <Image
                            src={
                                product.images && Array.isArray(product.images) && product.images[0] && typeof product.images[0] === 'string' && product.images[0].trim() !== ''
                                    ? product.images[0]
                                    : 'https://ik.imagekit.io/jrstupuke/placeholder.png'
                            }
                            alt={product.name}
                            fill
                            className={isEditorial ? "object-contain p-6" : "object-cover"}
                            onError={e => {
                                if (e.currentTarget.src !== 'https://ik.imagekit.io/jrstupuke/placeholder.png') {
                                    e.currentTarget.src = 'https://ik.imagekit.io/jrstupuke/placeholder.png';
                                }
                            }}
                        />
                    </div>
                    {/* Second image on hover - only if exists */}
                    {product.images && Array.isArray(product.images) && product.images[1] && product.images[1].trim() !== '' && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <Image
                                src={product.images[1]}
                                alt={product.name + ' alt'}
                                fill
                                className={isEditorial ? "object-contain p-6" : "object-cover"}
                            />
                        </div>
                    )}
                    {/* Wishlist Heart Icon */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toast.success('Added to wishlist');
                        }}
                        className={isEditorial
                            ? "absolute top-3 right-3 z-20 rounded-full bg-white/80 p-2 backdrop-blur-sm transition hover:bg-white"
                            : "absolute top-3 right-3 z-20 rounded-full border border-[#e8d8bf] bg-white/95 p-2 shadow-sm transition-all duration-200 hover:bg-[#f7edd8]"
                        }
                    >
                        <Heart size={16} className="text-[#2f2418] transition-colors hover:fill-[#b8873a] hover:text-[#b8873a]" strokeWidth={1.5} />
                    </button>
                    {isEditorial && (
                        <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#1c1610]/70 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                            <span className="mb-5 border border-[#d4b57a] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f7edd8]">
                                View piece
                            </span>
                        </div>
                    )}
                </div>
                {/* Product Details */}
                <div className={isEditorial ? "flex flex-col items-center gap-1.5 px-2 py-4 text-center" : "flex flex-col gap-1.5 p-3.5"}>
                    {product.category ? (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a67c36]">
                            {product.category}
                        </p>
                    ) : null}
                    <h3 className={isEditorial
                        ? "line-clamp-2 text-[15px] font-medium leading-snug tracking-wide text-[#2f2418]"
                        : "line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-[#2f2418] sm:text-[15px]"
                    }>
                        {product.name}
                    </h3>
                    {isEditorial && <span className="mt-1 h-px w-8 bg-[#d4b57a]" />}
                    {/* Reviews */}
                    {hasReviews && (
                        <div
                            className={isEditorial ? "flex items-center justify-center gap-2" : "flex items-center gap-2"}
                            aria-label={`Rating ${ratingValue.toFixed(1)} out of 5 from ${ratingCount} reviews`}
                        >
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = star <= Math.round(ratingValue)
                                    return (
                                        <StarIcon
                                            key={star}
                                            size={14}
                                            className={isFilled ? 'text-amber-500' : 'text-slate-300'}
                                            fill={isFilled ? 'currentColor' : 'none'}
                                        />
                                    )
                                })}
                            </div>
                            <span className="text-xs font-medium text-[#8a7457]">({ratingCount})</span>
                        </div>
                    )}
                    {/* Price */}
                    {showPriceBlock && (
                        <div className={isEditorial ? "flex items-end justify-center gap-2" : "flex items-end gap-2"}>
                            {showCurrentPrice && (
                                <span className="inline-flex items-end gap-1.5">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a7457]">{currency}</span>
                                    <span className="text-xl leading-none font-semibold text-[#2f2418]">{cardPrice.toLocaleString('en-IN')}</span>
                                </span>
                            )}
                            {showOriginalPrice && (
                                <span className="text-xs font-medium text-slate-400 line-through pb-1">
                                    {currency} {Number(product.AED).toLocaleString('en-IN')}
                                </span>
                            )}
                        </div>
                    )}
                    {/* Stock info */}
                    {product.stockQuantity && product.stockQuantity <= 3 && (
                        <span className="text-sm text-red-600">Only {product.stockQuantity} left!</span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default ProductCard

