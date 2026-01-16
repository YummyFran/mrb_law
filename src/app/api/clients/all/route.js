import { NextResponse } from "next/server";
import { getAuthUser } from "../../../../lib/auth";
import db from "../../../../lib/db";

export async function GET() {
    try {
        const { id: userId, userType } = await getAuthUser()

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            )
        }

        if (userType !== "attorney") {
            return NextResponse.json(
                { success: false, message: "Access denied. User is not an attorney." },
                { status: 403 }
            )
        }

        const [rows] = await db.query(
            `
                SELECT *
                FROM users
                WHERE userType = 'client'
            `,
            [userId]
        )

        return NextResponse.json({
            success: true,
            allClients: rows,
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Failed to fetch active cases" },
            { status: 500 }
        )
    }
}