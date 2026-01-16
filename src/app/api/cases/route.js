import { NextResponse } from "next/server";
import { getAuthUser } from "../../../lib/auth";
import db from "../../../lib/db";

export async function POST(req) {
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
        const {
            title,
            summary,
            priority,
            practice_area,
            court,
            client_id,
        } = await req.json();

        // Required fields
        if (!title || !client_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "title and client_id are required",
                },
                { status: 400 }
            );
        }

        // Validate client
        const [clientRows] = await db.execute(
            `
                SELECT id
                FROM users
                WHERE id = ?
                    AND userType = 'client'
            `,
            [client_id]
        );

        if (clientRows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid client_id" },
                { status: 400 }
            );
        }

        // Insert case
        const [result] = await db.execute(
            `
                INSERT INTO cases (
                    title,
                    summary,
                    practice_area,
                    court,
                    client_id,
                    assigned_attorney
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                title,
                summary || null,
                practice_area || null,
                court || null,
                client_id,
                user.id,
            ]
        );

        return NextResponse.json({
            success: true,
            message: "Case created successfully",
            case_id: result.insertId,
        });
    } catch (error) {
        console.error("Error creating case:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create case" },
            { status: 500 }
        );
    }
}
