'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId }) => {

    const { cartItems } = useSelector(state => state.cart);

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    return (
        <div className="inline-flex h-9 items-center overflow-hidden rounded-full border border-[#e4d2b3] bg-[#fffdf8] text-[#4a3a27]">
            <button
                type="button"
                onClick={removeFromCartHandler}
                className="h-9 w-8 select-none text-base leading-none hover:bg-[#f7edd8]"
                aria-label="Decrease quantity"
            >
                −
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-medium">{cartItems[productId] || 0}</span>
            <button
                type="button"
                onClick={addToCartHandler}
                className="h-9 w-8 select-none text-base leading-none hover:bg-[#f7edd8]"
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    )
}

export default Counter