'use client'
import { Suspense, useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '@/lib/features/product/productSlice'
import ProductCard from '@/components/ProductCard'
import { ChevronDownIcon, ChevronUpIcon, FilterIcon, XIcon, StarIcon, PlusIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function ProductsContent() {
    const dispatch = useDispatch();
    const products = useSelector(state => state.product.list)

    // Always fetch latest products on mount
    useEffect(() => {
        dispatch(fetchProducts({}))
    }, [dispatch])
    const searchParams = useSearchParams()
    const categoryParam = searchParams.get('category')

    const [showFilters, setShowFilters] = useState(false)
    const [showSortMenu, setShowSortMenu] = useState(false)
    const [showMoreCats, setShowMoreCats] = useState(false)
    const [expandedGroups, setExpandedGroups] = useState({ price: true, categories: true, rating: true, stock: false })
    const [filters, setFilters] = useState({
        categories: categoryParam ? [categoryParam] : [],
        priceRange: [0, 100000],
        minRating: 0,
        inStock: false
    })
    const [sortBy, setSortBy] = useState('newest') // newest, price-low, price-high, rating
    const [searchQuery, setSearchQuery] = useState('')

    const toggleGroup = (group) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))
    }

    // Get unique categories from products
    const categories = useMemo(() => {
        const cats = new Set()
        products.forEach(p => p.category && cats.add(p.category))
        return Array.from(cats).sort()
    }, [products])

    // Toggle category filter
    const toggleCategory = (category) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }))
    }

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            categories: [],
            priceRange: [0, 100000],
            minRating: 0,
            inStock: false
        })
        setSortBy('newest')
    }

    const applyPriceRange = (min, max) => {
        setFilters(prev => ({ ...prev, priceRange: [min, max] }))
    }

    const applyCategory = (label) => {
        // Map friendly labels to actual category keys where needed
        const category = label === 'Gold Jewellery' ? 'Gold' : label
        toggleCategory(category)
    }

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = [...products]

        // Only include products with a slug
        filtered = filtered.filter(p => p.slug && typeof p.slug === 'string' && p.slug.length > 0)

        // Filter by category
        if (filters.categories.length > 0) {
            filtered = filtered.filter(p => filters.categories.includes(p.category))
        }

        // Filter by price range
        filtered = filtered.filter(p => 
            p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
        )

        // Filter by rating
        if (filters.minRating > 0) {
            filtered = filtered.filter(p => {
                const avgRating = p.rating?.length 
                    ? p.rating.reduce((acc, r) => acc + r.rating, 0) / p.rating.length 
                    : 0
                return avgRating >= filters.minRating
            })
        }

        // Filter by stock
        if (filters.inStock) {
            filtered = filtered.filter(p => p.inStock)
        }

        // Text search filter
        if (searchQuery && searchQuery.trim().length > 0) {
            const q = searchQuery.trim().toLowerCase()
            filtered = filtered.filter(p => {
                const fields = [p.name, p.description, p.shortDescription, p.category]
                const tags = Array.isArray(p.tags) ? p.tags : []
                const inText = fields.some(f => typeof f === 'string' && f.toLowerCase().includes(q))
                const inTags = tags.some(t => String(t).toLowerCase().includes(q))
                return inText || inTags
            })
        }

        // Sort products
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price)
                break
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price)
                break
            case 'rating':
                filtered.sort((a, b) => {
                    const avgA = a.rating?.length ? a.rating.reduce((acc, r) => acc + r.rating, 0) / a.rating.length : 0
                    const avgB = b.rating?.length ? b.rating.reduce((acc, r) => acc + r.rating, 0) / b.rating.length : 0
                    return avgB - avgA
                })
                break
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
        }

        return filtered
    }, [products, filters, sortBy])

    const activeFiltersCount = 
        filters.categories.length + 
        (filters.minRating > 0 ? 1 : 0) + 
        (filters.inStock ? 1 : 0) +
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 ? 1 : 0)

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-[#231c16] px-4 py-12 text-center md:px-8 md:py-16">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4b57a]">Thessah Atelier</p>
                <h1 className="mt-3 text-4xl font-light tracking-wide text-[#f8f1e6] sm:text-5xl">
                    All Jewellery
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-sm font-light text-[#cbbda8]">
                    {filteredProducts.length} handcrafted {filteredProducts.length === 1 ? 'piece' : 'pieces'} from the collection
                </p>
            </div>
            <div className="mx-auto max-w-[1480px] px-4 py-8 md:px-6">
                <div className="mb-8 flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 rounded-xl border border-[#e4d2b3] bg-[#fffdf8] px-4 py-2.5 text-sm font-medium text-[#4a3a27] transition hover:bg-[#f7edd8]"
                    >
                        <FilterIcon size={18} />
                        <span>Filter</span>
                        {activeFiltersCount > 0 && (
                            <span className="ml-1 rounded-full bg-[#b8873a] px-2.5 py-0.5 text-xs font-semibold text-white">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    {/* Active Filter Chips - Modern Styling */}
                    <div className="flex flex-wrap gap-2">
                        {filters.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {filters.categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleCategory(cat)}
                                        className="flex items-center gap-2 rounded-xl border border-[#e4d2b3] bg-[#fffdf8] px-3 py-2 text-sm text-[#4a3a27] transition hover:bg-[#f7edd8]"
                                    >
                                        <span className="font-medium">{cat}</span>
                                        <XIcon size={14} className="text-gray-500" />
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) && (
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, 100000] }))}
                                className="flex items-center gap-2 rounded-xl border border-[#e4d2b3] bg-[#fffdf8] px-3 py-2 text-sm text-[#4a3a27] transition hover:bg-[#f7edd8]"
                            >
                                <span className="font-medium">AED {filters.priceRange[0].toLocaleString()} - AED {filters.priceRange[1].toLocaleString()}</span>
                                <XIcon size={14} className="text-[#a67c36]" />
                            </button>
                        )}

                        {filters.minRating > 0 && (
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, minRating: 0 }))}
                                className="flex items-center gap-2 rounded-xl border border-[#e4d2b3] bg-[#fffdf8] px-3 py-2 text-sm text-[#4a3a27] transition hover:bg-[#f7edd8]"
                            >
                                <span className="flex items-center gap-1 font-medium">
                                    <StarIcon size={14} className="fill-[#b8873a] text-[#b8873a]" />
                                    {filters.minRating}+ Rating
                                </span>
                                <XIcon size={14} className="text-[#a67c36]" />
                            </button>
                        )}

                        {filters.inStock && (
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, inStock: false }))}
                                className="flex items-center gap-2 rounded-xl border border-[#e4d2b3] bg-[#fffdf8] px-3 py-2 text-sm text-[#4a3a27] transition hover:bg-[#f7edd8]"
                            >
                                <span className="font-medium">In Stock Only</span>
                                <XIcon size={14} className="text-[#a67c36]" />
                            </button>
                        )}

                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="ml-2 text-sm font-semibold text-[#b8873a] underline hover:text-[#9b722f]"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="flex-1"></div>

                    <div className="relative">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="flex items-center gap-2 rounded-xl border border-[#e4d2b3] bg-[#fffdf8] px-4 py-2.5 text-sm font-medium text-[#4a3a27] transition hover:bg-[#f7edd8]"
                        >
                            <span className="text-[#8a7457]">Sort By</span>
                            <span className="min-w-[130px] text-left font-semibold text-[#2f2418]">
                                {sortBy === 'newest' && 'Best Matches'}
                                {sortBy === 'price-low' && 'Price: Low to High'}
                                {sortBy === 'price-high' && 'Price: High to Low'}
                                {sortBy === 'rating' && 'Top Rated'}
                            </span>
                            <ChevronDownIcon size={16} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showSortMenu && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setShowSortMenu(false)}></div>
                                <div className="absolute right-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-xl border border-[#ecdfcb] bg-[#fffdf8] p-1 shadow-[0_18px_40px_-24px_rgba(86,54,19,0.45)]">
                                    {[
                                        { value: 'newest', label: 'Best Matches' },
                                        { value: 'price-low', label: 'Price: Low to High' },
                                        { value: 'price-high', label: 'Price: High to Low' },
                                        { value: 'rating', label: 'Top Rated' },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setSortBy(option.value)
                                                setShowSortMenu(false)
                                            }}
                                            className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                                                sortBy === option.value
                                                    ? 'bg-[#f7edd8] text-[#2f2418]'
                                                    : 'text-[#4a3a27] hover:bg-[#fbf4e8]'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Filter Modal - Only on Filter Click */}
                {showFilters && (
                    <>
                        {/* Backdrop */}
                        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)}></div>
                        
                        <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-[#fffdf8] shadow-2xl sm:w-96">
                            <div className="sticky top-0 flex items-center justify-between border-b border-[#efe2cf] bg-gradient-to-r from-[#fffdf8] to-[#f8efdc] p-6">
                                <h2 className="text-xl font-semibold text-[#2f2418]">Filters</h2>
                                <button onClick={() => setShowFilters(false)} className="rounded-lg p-1 text-[#8a7457] transition hover:bg-[#f7edd8] hover:text-[#2f2418]">
                                    <XIcon size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Price Range - Always Visible */}
                                <div>
                                    <h3 className="mb-5 text-base font-semibold text-[#2f2418]">Price Range</h3>
                                    
                                    {/* Input Fields */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={filters.priceRange[0]}
                                            onChange={(e) => setFilters(prev => ({
                                                ...prev,
                                                priceRange: [Number(e.target.value) || 0, prev.priceRange[1]]
                                            }))}
                                            className="w-full rounded-xl border border-[#e4d2b3] bg-white px-3 py-2 text-sm text-[#2f2418] outline-none focus:border-[#b8873a] focus:ring-1 focus:ring-[#b8873a]"
                                        />
                                        <span className="text-gray-400">to</span>
                                        <input
                                            type="number"
                                            placeholder="100000"
                                            value={filters.priceRange[1]}
                                            onChange={(e) => setFilters(prev => ({
                                                ...prev,
                                                priceRange: [prev.priceRange[0], Number(e.target.value) || 100000]
                                            }))}
                                            className="w-full rounded-xl border border-[#e4d2b3] bg-white px-3 py-2 text-sm text-[#2f2418] outline-none focus:border-[#b8873a] focus:ring-1 focus:ring-[#b8873a]"
                                        />
                                    </div>

                                    {/* Preset Price Ranges */}
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { label: 'Under AED 5,000', value: [0, 5000] },
                                            { label: 'AED 5,000 - AED 10,000', value: [5000, 10000] },
                                            { label: 'AED 10,000 - AED 25,000', value: [10000, 25000] },
                                            { label: 'Over AED 25,000', value: [25000, 100000] },
                                        ].map((range) => (
                                            <button
                                                key={range.label}
                                                onClick={() => setFilters(prev => ({ ...prev, priceRange: range.value }))}
                                                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                                                    filters.priceRange[0] === range.value[0] && filters.priceRange[1] === range.value[1]
                                                        ? 'border-[#b8873a] bg-[#b8873a] text-white'
                                                        : 'border-[#e4d2b3] bg-white text-[#4a3a27] hover:bg-[#f7edd8]'
                                                }`}
                                            >
                                                {range.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200"></div>
                            </div>

                            {/* Action Buttons - Fixed at Bottom */}
                            <div className="sticky bottom-0 flex gap-3 border-t border-[#efe2cf] bg-[#fffdf8] p-6">
                                <button
                                    onClick={clearFilters}
                                    className="flex-1 rounded-xl border border-[#e4d2b3] px-4 py-3 font-semibold text-[#4a3a27] transition hover:bg-[#f7edd8]"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="flex-1 rounded-xl bg-[#b8873a] px-4 py-3 font-semibold text-white transition hover:bg-[#9b722f]"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex gap-6">

                    {/* Products Grid */}
                    <main className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="rounded-3xl border border-[#ecdfcb] bg-gradient-to-b from-[#fffdf8] to-[#fbf4e8] px-6 py-16 text-center">
                                <FilterIcon size={40} className="mx-auto mb-4 text-[#d0b890]" />
                                <h3 className="text-xl font-semibold text-[#2f2418]">No pieces found</h3>
                                <p className="mt-2 text-sm text-[#7a6650]">Try adjusting your filters to see more jewellery.</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-6 rounded-xl bg-[#b8873a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#9b722f]"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-10">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product._id} product={product} variant="editorial" />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default function AllProductsPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#231c16] text-[#cbbda8]">Loading jewellery…</div>}>
            <ProductsContent />
        </Suspense>
    )
}
