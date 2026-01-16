import { NextResponse } from "next/server";
import { getAuthUser} from "../../../../../lib/auth";
import db from "../../../../../lib/db";

export async function GET(req) {
    const { id: userId } = await getAuthUser()

    if (!userId) {
        return NextResponse.json(
            { success: false, message: "Invalid user ID" },
            { status: 400 }
        );
    }

    try {
        const [cases] = await db.execute(
            `
                SELECT c.*
                FROM cases c
                JOIN users u ON u.id = ?
                WHERE c.status = 'ongoing'
                    AND (
                        c.client_id = u.id
                        OR c.assigned_attorney = u.id
                        OR c.assigned_staff = u.id
                    )
                ORDER BY c.createdAt DESC
            `,
            [userId]
        );

        return NextResponse.json({
            success: true,
            cases
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch active cases" },
            { status: 500 }
        )
    }
}
