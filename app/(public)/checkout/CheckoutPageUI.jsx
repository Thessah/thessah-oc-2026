"use client";

import React, { useState, useEffect } from "react";
import { countryCodes } from "@/assets/countryCodes";
import { indiaStatesAndDistricts } from "@/assets/indiaStatesAndDistricts";
import { isUAECountry, uaeEmirates } from "@/assets/uaeEmirates";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { clearCart } from "@/lib/features/cart/cartSlice";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { fetchShippingSettings, calculateShipping } from "@/lib/shipping";
import { jewelleryUnitPrice } from "@/lib/pricing";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { ShoppingCart } from "lucide-react";
import JewelrySelect from "@/components/JewelrySelect";
import dynamic from "next/dynamic";

const fieldClass =
  "w-full rounded-xl border border-[#e4d2b3] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#2f2418] placeholder:text-[#b6a48a] outline-none transition focus:border-[#b8873a] focus:ring-1 focus:ring-[#b8873a]";

const SignInModal = dynamic(() => import("@/components/SignInModal"), { ssr: false });
const AddressModal = dynamic(() => import("@/components/AddressModal"), { ssr: false });

export default function CheckoutPage() {
  const { user, loading: authLoading, getToken } = useAuth();
  const dispatch = useDispatch();
  const addressList = useSelector((state) => state.address?.list || []);
  const addressFetchError = useSelector((state) => state.address?.error);
  const { cartItems } = useSelector((state) => state.cart);
  const products = useSelector((state) => state.product.list);

  const [form, setForm] = useState({
    addressId: "",
    payment: "cod",
    phoneCode: '+971',
    country: 'United Arab Emirates',
    state: '',
    district: '',
    street: '',
    city: '',
    pincode: '',
    name: '',
    email: '',
    phone: '',
  });

  const [districts, setDistricts] = useState([]);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [shippingSetting, setShippingSetting] = useState(null);
  const [shipping, setShipping] = useState(0);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [liveRates, setLiveRates] = useState(null);
  const [pricedById, setPricedById] = useState({});

  // Coupon logic
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!coupon.trim()) {
      setCouponError("Enter a coupon code to see discount.");
      return;
    }
    setCouponError("");
    // TODO: Add real coupon validation logic here
  };

  const router = useRouter();

  // Fetch products if not loaded
  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts({}));
    }
  }, [dispatch, products]);

  // Fetch addresses for logged-in users
  useEffect(() => {
    if (user && getToken) {
      dispatch(fetchAddress({ getToken }));
    }
  }, [user, getToken, dispatch]);

  // Auto-select first address
  useEffect(() => {
    if (user && addressList.length > 0 && !form.addressId) {
      setForm((f) => ({ ...f, addressId: addressList[0]._id }));
    }
  }, [user, addressList, form.addressId]);

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

  // Build cart array. Price follows the product-page gold total when the saved price is 0.
  const cartArray = [];
  for (const [key, value] of Object.entries(cartItems || {})) {
    const product = products?.find((p) => String(p._id) === String(key));
    const detail = pricedById[String(key)];
    const source = product || detail;
    if (source) {
      const merged = { ...source, ...(detail || {}) };
      cartArray.push({
        ...merged,
        quantity: value,
        price: jewelleryUnitPrice(merged, liveRates),
      });
    }
  }

  const subtotal = cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shipping;

  // Load shipping settings
  useEffect(() => {
    async function loadShipping() {
      const setting = await fetchShippingSettings();
      setShippingSetting(setting);
    }
    loadShipping();
  }, []);

  // Calculate dynamic shipping based on settings
  useEffect(() => {
    if (shippingSetting && cartArray.length > 0) {
      const calculatedShipping = calculateShipping({ cartItems: cartArray, shippingSetting });
      setShipping(calculatedShipping);
    } else {
      setShipping(0);
    }
  }, [shippingSetting, cartArray]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      const stateObj = indiaStatesAndDistricts.find(s => s.state === value);
      setDistricts(form.country === 'India' && stateObj ? stateObj.districts : []);
      setForm(f => ({ ...f, state: value, district: '' }));
    } else if (name === 'country') {
      const matchedCode = countryCodes.find((c) => c.label.replace(/ \(.*\)/, '') === value)?.code;
      setDistricts([]);
      setForm(f => ({
        ...f,
        country: value,
        state: '',
        district: '',
        phoneCode: matchedCode || (isUAECountry(value) ? '+971' : f.phoneCode),
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const [formError, setFormError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    // Validate required fields
    if (cartArray.length === 0) {
      setFormError("Your cart is empty.");
      return;
    }
    if (!Number.isFinite(subtotal) || subtotal <= 0 || !Number.isFinite(total) || total <= 0) {
      setFormError("Orders with AED 0 cannot be placed. Please add priced jewellery to continue.");
      return;
    }
    if (cartArray.some((item) => !Number.isFinite(Number(item.price)) || Number(item.price) <= 0)) {
      setFormError("One or more items have no price. Remove them before placing the order.");
      return;
    }
    setPlacingOrder(true);
    try {
      let addressId = form.addressId;
      // If logged in and no address selected, skip address creation for now
      // Orders can work without addressId
      
      // Validate payment method
      if (user && !form.payment) {
        setFormError("Please select a payment method.");
        setPlacingOrder(false);
        return;
      }
      if (!user) {
        if (!form.name || !form.phone || !form.street || !form.city || !form.state || !form.country) {
          setFormError("Please fill all required shipping details.");
          setPlacingOrder(false);
          return;
        }
        if (!form.payment) {
          setFormError("Please select a payment method.");
          setPlacingOrder(false);
          return;
        }
      }
      // Build order payload
      let payload;
      
      console.log('Checkout - User state:', user ? 'logged in' : 'guest');
      console.log('Checkout - User object:', user);
      
      if (user) {
        console.log('Building logged-in user payload...');
        payload = {
          items: cartArray.map(({ _id, quantity }) => ({ id: _id, quantity })),
          paymentMethod: form.payment === 'cod' ? 'COD' : form.payment.toUpperCase(),
          shippingFee: shipping,
        };
        // Only add addressId if it exists
        if (addressId || (addressList[0] && addressList[0]._id)) {
          payload.addressId = addressId || addressList[0]._id;
        } else if (form.street && form.city && form.state && form.country) {
          // User is logged in but has no saved address - include address in payload
          payload.addressData = {
            name: form.name || user.displayName || '',
            email: form.email || user.email || '',
            phone: form.phone || '',
            street: form.street,
            city: form.city,
            state: form.state,
            country: form.country || 'UAE',
            zip: form.zip || form.pincode || '000000',
            district: form.district || ''
          };
        }
      } else {
        console.log('Building guest payload...');
        payload = {
          isGuest: true,
          guestInfo: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.street,
            street: form.street,
            city: form.city,
            state: form.state,
            country: form.country || 'United Arab Emirates',
            pincode: form.pincode || '',
            district: form.district || '',
            zip: form.pincode || '000000',
          },
          items: cartArray.map(({ _id, quantity }) => ({ id: _id, quantity })),
          paymentMethod: form.payment === 'cod' ? 'COD' : form.payment.toUpperCase(),
          shippingFee: shipping,
        };
      }
      
      console.log('Submitting order:', payload);
      
      let fetchOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      };
      
      if (user && getToken) {
        console.log('Adding Authorization header for logged-in user...');
        const token = await getToken();
        console.log('Got token:', token ? 'yes' : 'no');
        fetchOptions.headers = {
          ...fetchOptions.headers,
          Authorization: `Bearer ${token}`,
        };
      } else {
        console.log('No Authorization header - guest checkout');
      }
      
      console.log('Final fetch options:', { ...fetchOptions, body: 'payload' });
      
      const res = await fetch("/api/orders", fetchOptions);
      if (!res.ok) {
        const errorText = await res.text();
        let msg = errorText;
        try {
          const data = JSON.parse(errorText);
          msg = data.message || data.error || errorText;
        } catch {}
        setFormError(msg);
        setPlacingOrder(false);
        return;
      }
      const data = await res.json();
      const orderId = data.id || data._id || data.order?._id || data.orders?.[0]?._id;
      setOrderComplete(true);
      if (!orderId) {
        router.replace("/order-failed");
        return;
      }
      router.replace(`/order-success?orderId=${orderId}`);
      dispatch(clearCart());
    } catch (err) {
      setFormError(err.message || "Order failed. Please try again.");
      router.replace("/order-failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (authLoading) return null;
  
  // Show loading state while products are being fetched
  if (!products || products.length === 0) {
    return (
      <div className="min-h-[50vh] bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_42%)] py-20 text-center text-[#7a6650]">
        Loading your jewellery bag...
      </div>
    );
  }
  
  if (!orderComplete && !placingOrder && (!cartItems || Object.keys(cartItems).length === 0)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_42%)] px-4 py-16">
        <div className="w-full max-w-xl rounded-3xl border border-[#ecdfcb] bg-gradient-to-b from-[#fffdf8] to-[#fbf4e8] px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#e8d8bf] bg-white">
            <ShoppingCart size={28} className="text-[#d0b890]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-semibold text-[#362717]">Your cart is empty</h1>
          <p className="mt-2 text-sm text-[#7f6a4f]">Add a piece you love, then come back to checkout.</p>
          <button
            onClick={() => router.push("/products")}
            className="mt-6 rounded-xl bg-[#b8873a] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#9b722f]"
          >
            Explore Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_42%)] py-8 sm:py-10">
      <div className="mx-auto mb-7 max-w-6xl px-4 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a67c36]">Secure Checkout</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#2f2418] sm:text-3xl">Complete your order</h1>
        <p className="mt-1 text-sm text-[#7a6650]">
          Review your jewellery bag, add shipping details, and place your order.
        </p>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        {/* Left column: address, form, payment */}
        <div>
          <div className="rounded-2xl border border-[#ecdfcb] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(86,54,19,0.45)] sm:p-7">
            {/* Cart Items Section */}
            <div className="mb-7">
              <h2 className="mb-3 text-lg font-semibold text-[#2f2418]">Cart Items</h2>
              <div className="space-y-3">
                {cartArray.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 rounded-2xl border border-[#efe2cf] bg-gradient-to-r from-white to-[#fffbf4] p-3">
                    <img src={item.image || item.images?.[0] || "https://ik.imagekit.io/jrstupuke/placeholder.png"} alt={item.name} className="h-16 w-16 rounded-xl border border-[#eddcc3] object-contain bg-white" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-[#2f2418]">{item.name}</div>
                      <div className="text-xs text-[#8a7457]">{item.category || item.brand || ""}</div>
                      <div className="mt-0.5 text-sm font-semibold text-[#b8873a]">AED {item.price.toLocaleString()}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="inline-flex h-8 items-center overflow-hidden rounded-full border border-[#e4d2b3] bg-[#fffdf8] text-[#4a3a27]">
                        <button type="button" className="h-8 w-7 hover:bg-[#f7edd8]" onClick={() => {
                          if (item.quantity > 1) {
                            dispatch({ type: 'cart/removeFromCart', payload: { productId: item._id } });
                          }
                        }}>−</button>
                        <span className="min-w-[1.25rem] text-center text-sm">{item.quantity}</span>
                        <button type="button" className="h-8 w-7 hover:bg-[#f7edd8]" onClick={() => {
                          dispatch({ type: 'cart/addToCart', payload: { productId: item._id } });
                        }}>+</button>
                      </div>
                      <button type="button" className="text-xs text-[#8a3b2a] hover:underline" onClick={() => {
                        dispatch({ type: 'cart/deleteItemFromCart', payload: { productId: item._id } });
                      }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Shipping Method Section */}
            <div className="mb-7">
              <h2 className="mb-3 text-lg font-semibold text-[#2f2418]">Choose Shipping Method</h2>
              <div className="flex items-center justify-between rounded-2xl border border-[#e4d2b3] bg-[#fffdf8] p-4">
                <div>
                  <div className="font-semibold text-[#2f2418]">{shipping === 0 ? "Complimentary Shipping" : "Standard Shipping"}</div>
                  <div className="text-xs text-[#7a6650]">Delivered within {shippingSetting?.estimatedDays || "2-5"} business days</div>
                </div>
                <div className={`text-sm font-semibold ${shipping === 0 ? "text-[#2d7a4f]" : "text-[#2f2418]"}`}>
                  {shipping === 0 ? "Free" : `AED ${shipping.toLocaleString()}`}
                </div>
              </div>
            </div>
            {/* Shipping Details Section */}
            <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
              {formError && <div className="mb-2 rounded-xl border border-[#e8c7bc] bg-[#fff6f3] px-4 py-3 text-sm font-medium text-[#8a3b2a]">{formError}</div>}
              
              {/* Guest Checkout Notice */}
              {!user && (
                <div className="rounded-2xl border border-[#e4d2b3] bg-[#fffdf8] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="mb-1 font-semibold text-[#2f2418]">Checkout as Guest</h3>
                      <p className="text-sm text-[#7a6650]">You can place your order without creating an account.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSignIn(true)}
                      className="whitespace-nowrap text-sm font-semibold text-[#b8873a] hover:text-[#9b722f]"
                    >
                      Sign In Instead
                    </button>
                  </div>
                </div>
              )}
              
              <h2 className="text-lg font-semibold text-[#2f2418]">Shipping details</h2>
              {/* ...existing code for address/guest form... */}
              {/* Show address fetch error if present */}
              {addressFetchError && (
                <div className="mb-2 rounded-xl border border-[#e8c7bc] bg-[#fff6f3] px-4 py-3 text-sm text-[#8a3b2a]">
                  {addressFetchError === 'Unauthorized' ? (
                    <>
                      You are not logged in or your session expired. <button className="font-semibold text-[#b8873a] underline" type="button" onClick={() => setShowSignIn(true)}>Sign in again</button>.
                    </>
                  ) : addressFetchError}
                </div>
              )}
              {addressList.length > 0 && !showAddressModal && !addressFetchError ? (
                <div className="mb-2 flex items-start justify-between gap-4 rounded-2xl border border-[#e4d2b3] bg-[#fffdf8] p-4">
                  <div>
                    <div className="font-semibold text-[#2f2418]">{addressList[0].name}</div>
                    <div className="text-sm text-[#b8873a]">{addressList[0].district || addressList[0].city}</div>
                    <div className="text-sm text-[#4a3a27]">{addressList[0].street}</div>
                    <div className="text-sm text-[#4a3a27]">{addressList[0].city}, {addressList[0].state}, {addressList[0].country}</div>
                    <div className="mt-1 text-sm font-semibold text-[#b8873a]">{addressList[0].phoneCode} {addressList[0].phone}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button type="button" className="text-xs font-semibold text-[#b8873a] hover:underline" onClick={() => setShowAddressModal(true)}>
                      Change address
                    </button>
                    <button type="button" className="text-xs font-semibold text-[#b8873a] hover:underline" onClick={() => setShowAddressModal(true)}>
                      Add new address
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-2 flex flex-col gap-3">
                  <input
                    className={fieldClass}
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name || ''}
                    onChange={handleChange}
                    required
                  />
                  <div className="flex gap-2">
                    <JewelrySelect
                      name="phoneCode"
                      value={form.phoneCode}
                      onChange={handleChange}
                      required
                      className="w-[118px] shrink-0"
                      options={countryCodes.map((c) => ({ value: c.code, label: c.code }))}
                    />
                    <input
                      className={fieldClass}
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={form.phone || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <input
                    className={fieldClass}
                    type="email"
                    name="email"
                    placeholder="Email address (optional)"
                    value={form.email || ''}
                    onChange={handleChange}
                  />
                  <JewelrySelect
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                    options={[
                      { value: "United Arab Emirates", label: "United Arab Emirates" },
                      { value: "India", label: "India" },
                      ...countryCodes
                        .filter((c) => c.label !== "India" && !c.label.includes("United Arab Emirates"))
                        .map((c) => {
                          const label = c.label.replace(/ \(.*\)/, "");
                          return { value: label, label };
                        }),
                    ]}
                  />
                  <JewelrySelect
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    placeholder={isUAECountry(form.country) ? "Select Emirate" : form.country === "India" ? "Select State" : "Select Region"}
                    options={
                      isUAECountry(form.country)
                        ? uaeEmirates.map((emirate) => ({ value: emirate, label: emirate }))
                        : form.country === "India"
                          ? indiaStatesAndDistricts.map((s) => ({ value: s.state, label: s.state }))
                          : []
                    }
                  />
                  {form.country === 'India' && (
                    <JewelrySelect
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      required={!!form.state}
                      disabled={!form.state}
                      placeholder="Select District"
                      options={districts.map((d) => ({ value: d, label: d }))}
                    />
                  )}
                  <input
                    className={fieldClass}
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city || ''}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className={fieldClass}
                    type="text"
                    name="street"
                    placeholder="Full Address Line (Street, Building, Apartment)"
                    value={form.street || ''}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className={fieldClass}
                    type="text"
                    name="pincode"
                    placeholder={isUAECountry(form.country) ? "PO Box / Postal code (optional)" : "Pincode"}
                    value={form.pincode || ''}
                    onChange={handleChange}
                    required={form.country === 'India'}
                  />
                </div>
              )}
              <h2 className="text-lg font-semibold text-[#2f2418]">Payment methods</h2>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#e4d2b3] bg-[#fffdf8] px-4 py-3">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={form.payment === 'cod'}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#b8873a]"
                />
                <span className="text-sm font-semibold text-[#2f2418]">Cash on Delivery</span>
              </label>
            </form>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#ecdfcb] bg-white shadow-[0_18px_40px_-32px_rgba(86,54,19,0.45)] lg:sticky lg:top-6">
          <div className="border-b border-[#f1e8da] bg-gradient-to-r from-[#fffdf8] to-[#f8efdc] px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a67c36]">Order Details</p>
            <h2 className="mt-1 text-lg font-semibold text-[#2f2418]">Review &amp; pay</h2>
          </div>
          <form onSubmit={handleApplyCoupon} className="flex gap-2 px-5 pt-5">
            <input
              type="text"
              className={fieldClass}
              placeholder="Discount code or coupon"
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-[#2f2418] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a3a27]"
            >
              Apply
            </button>
          </form>
          {couponError && <div className="px-5 pt-2 text-xs text-[#8a3b2a]">{couponError}</div>}
          <div className="space-y-3 px-5 py-5 text-sm">
            <div className="flex justify-between text-[#6f5a42]">
              <span>Items</span>
              <span className="text-[#2f2418]">AED {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className={shipping === 0 ? "font-medium text-[#2d7a4f]" : "text-[#6f5a42]"}>Shipping &amp; handling</span>
              <span className={shipping === 0 ? "font-semibold text-[#2d7a4f]" : "text-[#2f2418]"}>
                {shipping > 0 ? `AED ${shipping.toLocaleString()}` : "Complimentary"}
              </span>
            </div>
            <div className="border-t border-[#f1e8da] pt-3">
              <div className="flex justify-between text-base font-semibold text-[#2f2418]">
                <span>Total</span>
                <span>AED {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="px-5 pb-5">
            {(subtotal <= 0 || total <= 0) && (
              <p className="mb-3 text-center text-xs text-[#8a3b2a]">
                Orders with AED 0 cannot be placed. Please add priced jewellery to continue.
              </p>
            )}
            <button
              type="submit"
              form="checkout-form"
              className="w-full rounded-xl bg-[#b8873a] py-3 text-sm font-semibold text-white transition hover:bg-[#9b722f] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={placingOrder || subtotal <= 0 || total <= 0}
            >
              {placingOrder ? "Placing order..." : "Place order"}
            </button>
          </div>
        </div>
      </div>
      <AddressModal open={showAddressModal} setShowAddressModal={setShowAddressModal} onAddressAdded={(addr) => {
        setForm(f => ({ ...f, addressId: addr._id }));
        dispatch(fetchAddress({ getToken }));
      }} />
      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </div>
  );
}