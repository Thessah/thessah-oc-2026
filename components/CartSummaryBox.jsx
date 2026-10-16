import React from "react";
import { useRouter } from "next/navigation";

export default function CartSummaryBox({ subtotal, shipping, total }) {
  const router = useRouter();
  const canCheckout = Number(subtotal) > 0;
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#ecdfcb] bg-white shadow-[0_18px_40px_-32px_rgba(86,54,19,0.45)]">
      <div className="border-b border-[#f1e8da] bg-gradient-to-r from-[#fffdf8] to-[#f8efdc] px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a67c36]">Order Summary</p>
        <h2 className="mt-1 text-lg font-semibold text-[#2f2418]">Ready to checkout</h2>
      </div>
      <div className="space-y-3 px-5 py-5 text-sm">
        <div className="flex items-center justify-between text-[#6f5a42]">
          <span>Items</span>
          <span className="text-[#2f2418]">AED {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={shipping === 0 ? "font-medium text-[#2d7a4f]" : "text-[#6f5a42]"}>
            Shipping &amp; handling
          </span>
          <span className={shipping === 0 ? "font-semibold text-[#2d7a4f]" : "text-[#2f2418]"}>
            {shipping === 0 ? "Complimentary" : `AED ${shipping.toLocaleString()}`}
          </span>
        </div>
        <div className="border-t border-[#f1e8da] pt-3">
          <div className="flex items-center justify-between text-base font-semibold text-[#2f2418]">
            <span>Total</span>
            <span>AED {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="px-5 pb-5">
        {!canCheckout && (
          <p className="mb-3 text-center text-xs text-[#8a3b2a]">
            Items with AED 0 cannot be checked out. Please choose priced jewellery.
          </p>
        )}
        <button
          type="button"
          disabled={!canCheckout}
          className="w-full rounded-xl bg-[#b8873a] py-3 text-sm font-semibold text-white transition hover:bg-[#9b722f] disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            if (!canCheckout) return;
            router.push("/checkout");
          }}
        >
          Proceed to Checkout
        </button>
        <button
          type="button"
          className="mt-3 w-full rounded-xl border border-[#e4d2b3] bg-[#fffdf8] py-2.5 text-sm font-medium text-[#4a3a27] transition hover:bg-[#f7edd8]"
          onClick={() => router.push("/products")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
