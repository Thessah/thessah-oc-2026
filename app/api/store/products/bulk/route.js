import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import authSeller from "@/middlewares/authSeller";
import { optionalFirebaseAuth } from "@/lib/firebase-auth-helper";
import { NextResponse } from "next/server";

const OBJECT_ID = /^[a-fA-F0-9]{24}$/;

export async function POST(request) {
    try {
        const user = await optionalFirebaseAuth(request);
        const userId = user?.uid || null;
        if (!userId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }

        const storeId = await authSeller(userId);
        if (!storeId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }

        const body = await request.json();
        const productIds = Array.isArray(body?.productIds) ? body.productIds : [];
        const validIds = [...new Set(productIds.filter((id) => typeof id === "string" && OBJECT_ID.test(id)))];
        if (!validIds.length) {
            return NextResponse.json({ error: "Select at least one product" }, { status: 400 });
        }
        if (validIds.length > 500) {
            return NextResponse.json({ error: "Select 500 products or fewer at a time" }, { status: 400 });
        }

        const update = {};
        if (typeof body.inStock === "boolean") update.inStock = body.inStock;
        if (body.listingStatus === "online" || body.listingStatus === "draft") {
            update.listingStatus = body.listingStatus;
        }
        if (!Object.keys(update).length) {
            return NextResponse.json({ error: "Choose stock or listing status" }, { status: 400 });
        }

        await dbConnect();
        const result = await Product.updateMany(
            { _id: { $in: validIds }, storeId },
            { $set: update }
        );

        return NextResponse.json({
            message: "Products updated",
            updated: result.modifiedCount,
            matched: result.matchedCount,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}
