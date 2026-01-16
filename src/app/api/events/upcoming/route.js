import { NextResponse } from "next/server";
import { getAuthUser } from "../../../../lib/auth";
import db from "../../../../lib/db";

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
        const [hearings] = await db.execute(
            `
                SELECT 
                    h.id,
                    h.title,
                    h.description,
                    h.hearing_type,
                    h.hearing_date,
                    h.location,
                    h.status,
                    c.id AS case_id,
                    c.case_number,
                    c.title AS case_title
                FROM hearings h
                JOIN cases c ON c.id = h.case_id
                WHERE c.assigned_attorney = ?
                    AND h.hearing_date >= NOW()
                    AND h.status = 'scheduled'
                ORDER BY h.hearing_date ASC
            `,
            [user.id]
        );

        return NextResponse.json({
            success: true,
            hearings,
        });
    } catch (error) {
        console.error("Error fetching upcoming hearings:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch upcoming hearings" },
            { status: 500 }
        );
    }
}
