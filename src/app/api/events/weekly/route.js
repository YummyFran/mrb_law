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
            { success: false, message: "Access denied" },
            { status: 403 }
        );
    }

    try {
        // Fetch hearings within the next 7 days
        const [rows] = await db.execute(
            `
                SELECT 
                    h.id,
                    h.title,
                    h.hearing_type,
                    h.hearing_date,
                    h.location,
                    c.id AS case_id,
                    c.title AS case_title
                FROM hearings h
                JOIN cases c ON c.id = h.case_id
                WHERE c.assigned_attorney = ?
                    AND h.status = 'scheduled'
                    AND h.hearing_date >= CURDATE()
                    AND h.hearing_date < DATE_ADD(CURDATE(), INTERVAL 7 DAY)
                ORDER BY h.hearing_date ASC
            `,
            [user.id]
        );

        // Build next 7 days skeleton
        const today = new Date();
        const days = [];

        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);

            const dateStr = d.toISOString().split("T")[0];

            days.push({
                date: dateStr,
                day: d.toLocaleDateString("en-US", {
                    weekday: "short",
                }).toUpperCase(),
                events: [],
            });
        }

        // Assign hearings to correct day
        rows.forEach((event) => {
            const eventDate = new Date(event.hearing_date)
                .toISOString()
                .split("T")[0];

            const dayBucket = days.find(d => d.date === eventDate);
            if (dayBucket) {
                dayBucket.events.push(event);
            }
        });

        return NextResponse.json({
            success: true,
            days,
        });
    } catch (error) {
        console.error("Error fetching weekly events:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch events" },
            { status: 500 }
        );
    }
}
