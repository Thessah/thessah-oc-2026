"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Check, Copy, ShoppingBag } from "lucide-react";
import { useAuth } from "@/lib/useAuth";

export default function OrderSuccess() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}

function getOrderNumber(id) {
  if (!id) return "";
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return String((hash % 900000) + 100000);
}

function getProduct(item) {
  const product = item?.product || item?.productId || {};
  return {
    name: item?.name || product.name || "Jewellery piece",
    image: Array.isArray(product.images) ? product.images[0] : product.image,
    price: Number(item?.price) || Number(product.price) || 0,
    quantity: item?.quantity || 1,
  };
}

function OrderSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { user, loading: authLoading, getToken } = useAuth();

  useEffect(() => {
    const fetchOrder = async (orderId) => {
      try {
        const fetchOptions = {};
        if (user && getToken) {
          const token = await getToken();
          fetchOptions.headers = { Authorization: `Bearer ${token}` };
        }
        const res = await fetch(`/api/orders?orderId=${orderId}`, fetchOptions);
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else if (data.order) {
          setOrders([data.order]);
        } else {
          setOrders(null);
        }
      } catch {
        setOrders(null);
      } finally {
        setLoading(false);
      }
    };

    const orderId = params.get("orderId");
    if (!orderId) {
      setLoading(false);
      setOrders(null);
      return;
    }
    if (authLoading) return;
    fetchOrder(orderId);
  }, [params, user, authLoading, getToken]);

  const order = orders?.[0] || null;
  const products = order ? (order.orderItems || []).map(getProduct) : [];
  const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = typeof order?.shippingFee === "number" ? order.shippingFee : 0;
  const discount = order?.coupon?.discount
    ? order.coupon.discountType === "percentage"
      ? (order.coupon.discount / 100) * subtotal
      : Math.min(order.coupon.discount, subtotal)
    : 0;
  const total = order?.total || subtotal + shipping - discount;
  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();
  const currency = order?.currency || "AED";
  const orderNumber = getOrderNumber(order?._id);
  const rawOrderId = order?._id;

  useEffect(() => {
    if (order && typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Purchase", { value: total, currency });
    }
  }, [order, total, currency]);

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_42%)] py-20 text-center text-[#7a6650]">
        Confirming your order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_42%)] px-4 py-16">
        <div className="w-full max-w-xl rounded-3xl border border-[#ecdfcb] bg-gradient-to-b from-[#fffdf8] to-[#fbf4e8] px-6 py-12 text-center">
          <h1 className="text-2xl font-semibold text-[#362717]">Order not found</h1>
          <p className="mt-2 text-sm text-[#7f6a4f]">
            We could not load this order. Please check your order number or contact support.
          </p>
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
    <div className="min-h-[70vh] bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_42%)] py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-[#ecdfcb] bg-white shadow-[0_20px_50px_-34px_rgba(86,54,19,0.45)]">
          <div className="bg-gradient-to-r from-[#fffdf8] to-[#f8efdc] px-6 py-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#e8d8bf] bg-white text-[#2d7a4f]">
              <Check size={30} strokeWidth={2.2} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a67c36]">
              Order Confirmed
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-[#2f2418] sm:text-3xl">Thank you</h1>
            <p className="mt-2 text-sm text-[#7a6650]">
              Your jewellery order has been received and is being prepared.
            </p>
          </div>

          <div className="px-6 py-6 text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8a7457]">Order no.</p>
            <p className="mt-1 text-3xl font-semibold text-[#b8873a]">{orderNumber}</p>
            <button
              type="button"
              onClick={copyOrderNumber}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#8a7457] hover:text-[#2f2418]"
            >
              <Copy size={12} />
              {copied ? "Copied" : "Copy order number"}
            </button>
          </div>

          <div className="mx-6 mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-[#efe2cf] bg-[#fffdf8] p-4 text-sm">
            <div>
              <p className="text-xs text-[#8a7457]">Order date</p>
              <p className="mt-0.5 font-medium text-[#2f2418]">{orderDate}</p>
            </div>
            <div>
              <p className="text-xs text-[#8a7457]">Payment</p>
              <p className="mt-0.5 font-medium text-[#2f2418]">{order?.paymentMethod || "COD"}</p>
            </div>
            <div>
              <p className="text-xs text-[#8a7457]">Items</p>
              <p className="mt-0.5 font-medium text-[#2f2418]">{products.length}</p>
            </div>
            <div>
              <p className="text-xs text-[#8a7457]">Total</p>
              <p className="mt-0.5 font-semibold text-[#2f2418]">
                {currency} {Number(total).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <h2 className="mb-3 text-lg font-semibold text-[#2f2418]">Order summary</h2>
            <div className="space-y-3">
              {products.map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="flex items-center gap-3 rounded-2xl border border-[#efe2cf] bg-gradient-to-r from-white to-[#fffbf4] p-3">
                  <div className="h-14 w-14 overflow-hidden rounded-xl border border-[#eddcc3] bg-white">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#d0b890]">
                        <ShoppingBag size={18} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#2f2418]">{item.name}</p>
                    <p className="text-xs text-[#8a7457]">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#b8873a]">
                    {currency} {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between text-[#6f5a42]">
                <span>Items</span>
                <span className="text-[#2f2418]">{currency} {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6f5a42]">
                <span>Discount</span>
                <span>-{currency} {discount ? discount.toLocaleString() : "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className={shipping === 0 ? "font-medium text-[#2d7a4f]" : "text-[#6f5a42]"}>
                  Shipping &amp; handling
                </span>
                <span className={shipping === 0 ? "font-semibold text-[#2d7a4f]" : "text-[#2f2418]"}>
                  {shipping === 0 ? "Complimentary" : `${currency} ${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t border-[#f1e8da] pt-2">
                <div className="flex justify-between text-base font-semibold text-[#2f2418]">
                  <span>Total</span>
                  <span>{currency} {Number(total).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#f1e8da] px-6 py-5">
            <p className="mb-4 text-center text-sm text-[#7a6650]">
              Use your order number to track this purchase. Sign in to save it in your account.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push(rawOrderId ? `/track-order?orderId=${rawOrderId}` : "/track-order")}
                className="w-full rounded-xl border border-[#e4d2b3] bg-[#fffdf8] py-3 text-sm font-medium text-[#4a3a27] transition hover:bg-[#f7edd8]"
              >
                Track order
              </button>
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="w-full rounded-xl bg-[#b8873a] py-3 text-sm font-semibold text-white transition hover:bg-[#9b722f]"
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
