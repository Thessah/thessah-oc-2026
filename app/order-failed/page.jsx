"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function OrderFailed() {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_42%)] px-4 py-16">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-[#ecdfcb] bg-white text-center shadow-[0_20px_50px_-34px_rgba(86,54,19,0.45)]">
        <div className="bg-gradient-to-r from-[#fffdf8] to-[#f8efdc] px-6 py-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#e8c7bc] bg-white text-[#8a3b2a]">
            <X size={28} strokeWidth={2.2} />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a67c36]">
            Payment Incomplete
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[#2f2418] sm:text-3xl">Order failed</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[#7a6650]">
            We could not complete this order. Your cart is still available, so you can try again or continue shopping.
          </p>
        </div>
        <div className="flex flex-col gap-3 px-6 py-6 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className="w-full rounded-xl bg-[#b8873a] py-3 text-sm font-semibold text-white transition hover:bg-[#9b722f]"
          >
            Try checkout again
          </button>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="w-full rounded-xl border border-[#e4d2b3] bg-[#fffdf8] py-3 text-sm font-medium text-[#4a3a27] transition hover:bg-[#f7edd8]"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}
