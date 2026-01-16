import { NextResponse } from "next/server";
import { getAuthUser } from "../../../../lib/auth";
import db from "../../../../lib/db";

export async function GET(req, { params }) {
    const user = await getAuthUser();

    if (!user || !user.id) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { id: hearingId } = await params;

    if (!hearingId) {
        return NextResponse.json(
            { success: false, message: "Hearing ID is required" },
            { status: 400 }
        );
    }

    try {
        const [rows] = await db.execute(
            `
                SELECT
                    h.id,
                    h.title,
                    h.description,
                    h.hearing_type,
                    h.hearing_date,
                    h.location,
                    h.status,
                    h.outcome,

                    c.id AS case_id,
                    c.case_number,
                    c.title AS case_title,
                    c.practice_area,
                    c.court,

                    hp.role AS participant_role
                FROM hearings h
                JOIN hearing_participants hp
                    ON hp.hearing_id = h.id
                JOIN cases c
                    ON c.id = h.case_id
                WHERE h.id = ?
                    AND hp.user_id = ?
                LIMIT 1
            `,
            [hearingId, user.id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Hearing not found or access denied" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            hearing: rows[0],
        });
    } catch (error) {
        console.error("Fetch hearing by ID error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch hearing" },
            { status: 500 }
        );
    }
}

export async function PATCH(req, { params }) {
    const user = await getAuthUser();

    if (!user || !user.id) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { id: hearingId } = await params;

    if (!hearingId) {
        return NextResponse.json(
            { success: false, message: "Hearing ID is required" },
            { status: 400 }
        );
    }

    const body = await req.json();
    const { title, description, status } = body;

    if (!title && !description && !status) {
        return NextResponse.json(
            { success: false, message: "Nothing to update" },
            { status: 400 }
        );
    }

    try {
        // Check if hearing exists and if the user is the assigned attorney
        const [rows] = await db.execute(
            `
            SELECT h.id, c.assigned_attorney
            FROM hearings h
            JOIN cases c ON c.id = h.case_id
            WHERE h.id = ?
            LIMIT 1
            `,
            [hearingId]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Hearing not found" },
                { status: 404 }
            );
        }

        const hearing = rows[0];

        if (hearing.assigned_attorney !== user.id) {
            return NextResponse.json(
                { success: false, message: "Forbidden: Only the assigned attorney can update this hearing" },
                { status: 403 }
            );
        }

        // Build dynamic query for updating only provided fields
        const fields = [];
        const values = [];

        if (title) {
            fields.push("title = ?");
            values.push(title);
        }

        if (description) {
            fields.push("description = ?");
            values.push(description);
        }

        if(status) {
            fields.push("status = ?")
            values.push(status)
        }

        values.push(hearingId); // For WHERE clause

        await db.execute(
            `UPDATE hearings SET ${fields.join(", ")} WHERE id = ?`,
            values
        );

        return NextResponse.json({
            success: true,
            message: "Hearing updated successfully",
        });
    } catch (error) {
        console.error("Update hearing error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update hearing" },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    const user = await getAuthUser();

    if (!user || !user.id) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { id: hearingId } = await params;

    if (!hearingId) {
        return NextResponse.json(
            { success: false, message: "Hearing ID is required" },
            { status: 400 }
        );
    }

    try {
        // Check if hearing exists and if the user is the assigned attorney
        const [rows] = await db.execute(
            `
            SELECT h.id, c.assigned_attorney
            FROM hearings h
            JOIN cases c ON c.id = h.case_id
            WHERE h.id = ?
            LIMIT 1
            `,
            [hearingId]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Hearing not found" },
                { status: 404 }
            );
        }

        const hearing = rows[0];

        if (hearing.assigned_attorney !== user.id) {
            return NextResponse.json(
                { success: false, message: "Forbidden: Only the assigned attorney can delete this hearing" },
                { status: 403 }
            );
        }

        // Delete the hearing
        await db.execute(
            `DELETE FROM hearings WHERE id = ?`,
            [hearingId]
        );

        return NextResponse.json({
            success: true,
            message: "Hearing deleted successfully",
        });
    } catch (error) {
        console.error("Delete hearing error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete hearing" },
            { status: 500 }
        );
    }
}