import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuthUser } from "../../../lib/auth";
import db from "../../../lib/db";

export async function GET() {
    const { id: userId } = await getAuthUser()

    if (!userId) {
        return NextResponse.json(
            { success: false, message: "Invalid user ID" },
            { status: 400 }
        );
    }

    try {
        const [hearings] = await db.execute(
            `
            SELECT
                h.id,
                h.title,
                h.hearing_type,
                h.hearing_date,
                h.location,
                h.status,
                h.outcome,
                h.case_id,

                c.case_number,
                c.title AS case_title,

                hp.role AS participant_role

            FROM hearings h
            JOIN hearing_participants hp
                ON hp.hearing_id = h.id
            JOIN cases c
                ON c.id = h.case_id

            WHERE hp.user_id = ?
            ORDER BY h.hearing_date ASC
        `,
            [userId]
        );

        return NextResponse.json({
            success: true,
            hearings
        });
    } catch (error) {
        console.error("Fetch hearings error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch hearings" },
            { status: 500 }
        );
    }
}

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
            case_id,
            title,
            description,
            hearing_type,
            hearing_date,
            location,
        } = await req.json();

        // Validation
        if (!case_id || !title || !hearing_date) {
            return NextResponse.json(
                {
                    success: false,
                    message: "case_id, title, and hearing_date are required",
                },
                { status: 400 }
            );
        }

        // Verify attorney owns the case + get participants
        const [caseRows] = await db.execute(
            `
                SELECT client_id, assigned_staff
                FROM cases
                WHERE id = ?
                    AND assigned_attorney = ?
            `,
            [case_id, user.id]
        );

        if (caseRows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid case or access denied" },
                { status: 403 }
            );
        }

        const { client_id, assigned_staff } = caseRows[0];

        // Create hearing
        const [result] = await db.execute(
            `
                INSERT INTO hearings (
                    case_id,
                    title,
                    description,
                    hearing_type,
                    hearing_date,
                    location
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                case_id,
                title,
                description || null,
                hearing_type || "other",
                hearing_date,
                location || null,
            ]
        );

        const hearingId = result.insertId;

        // Add participants
        const participantQueries = [];

        // Attorney
        participantQueries.push(
            db.execute(
                `
                    INSERT IGNORE INTO hearing_participants (hearing_id, user_id, role)
                    VALUES (?, ?, 'attorney')
                `,
                [hearingId, user.id]
            )
        );

        // Client
        if (client_id) {
            participantQueries.push(
                db.execute(
                    `
                    INSERT IGNORE INTO hearing_participants (hearing_id, user_id, role)
                    VALUES (?, ?, 'client')
                `,
                    [hearingId, client_id]
                )
            );
        }

        // Staff (optional)
        if (assigned_staff) {
            participantQueries.push(
                db.execute(
                    `
                        INSERT IGNORE INTO hearing_participants (hearing_id, user_id, role)
                        VALUES (?, ?, 'staff')
                    `,
                    [hearingId, assigned_staff]
                )
            );
        }

        await Promise.all(participantQueries);

        return NextResponse.json({
            success: true,
            message: "Hearing created successfully",
            hearing_id: hearingId,
        });
    } catch (error) {
        console.error("Error creating hearing:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create hearing" },
            { status: 500 }
        );
    }
}


