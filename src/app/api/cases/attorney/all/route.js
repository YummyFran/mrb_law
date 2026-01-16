import { NextResponse } from "next/server";
import { getAuthUser } from "../../../../../lib/auth";
import db from "../../../../../lib/db";

export async function GET() {
    const user = await getAuthUser();

    if (!user || !user.id) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    if (user.userType !== "attorney") {
        return NextResponse.json(
            { success: false, message: "Access denied. Not an attorney." },
            { status: 403 }
        );
    }

    try {
        const [cases] = await db.execute(
            `
                SELECT c.*, u.name as clientName
                FROM cases c INNER JOIN users u ON c.client_id = u.id
                WHERE c.assigned_attorney = ?
                ORDER BY c.createdAt DESC
            `,
            [user.id]
        );

        return NextResponse.json({
            success: true,
            cases,
        });
    } catch (error) {
        console.error("Error fetching attorney active cases:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch active cases" },
            { status: 500 }
        );
    }
}
