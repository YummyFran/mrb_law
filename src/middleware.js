import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
    "/",
    "/signin",
    "/signup",
    "/api/auth/signin",
    "/api/auth/signup",
    "/api/auth/me",
];

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;

    const isPublicRoute = PUBLIC_PATHS.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );


    /* ---------------- PUBLIC ROUTES ---------------- */
    if (isPublicRoute) {
        if (token && (pathname === "/signin" || pathname === "/signup")) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    /* ---------------- AUTH REQUIRED ---------------- */
    if (!token) {
        if (pathname.startsWith("/api")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.redirect(new URL("/signin", req.url));
    }

    let user;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret)

        user = payload
    } catch (err) {
        console.error("JWT Error:", err);

        if (pathname.startsWith("/api")) {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 401 }
            );
        }

        return NextResponse.redirect(new URL("/signin", req.url));
    }

    const role = user.userType?.toLowerCase();

    /* ---------------- API ACCESS ---------------- */

    // if (pathname.startsWith("/api/client") && role !== "client") {
    //     return NextResponse.json(
    //         { message: "Forbidden" },
    //         { status: 403 }
    //     );
    // }

    // if (pathname.startsWith("/api/attorney") && role !== "attorney") {
    //     return NextResponse.json(
    //         { message: "Forbidden" },
    //         { status: 403 }
    //     );
    // }

    // if (pathname.startsWith("/api/staff") && role !== "staff") {
    //     return NextResponse.json(
    //         { message: "Forbidden" },
    //         { status: 403 }
    //     );
    // }

    /* ---------------- FORWARD USER PAYLOAD ---------------- */
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user", JSON.stringify(user));

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        "/",
        "/signin",
        "/signup",
        "/api/:path*",
        "/events",
        "/hearings",
        "/cases"
    ],
};
