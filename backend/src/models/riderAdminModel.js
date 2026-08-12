const pool = require("../config/db");

// ============================================================
// GET ALL RIDERS
// ============================================================

exports.getAllRiders = async () => {
    const result = await pool.query(`
        SELECT
            id,
            name,
            phone,
            vehicle_type,
            vehicle_number,
            status,
            is_active,
            created_at
        FROM riders
        ORDER BY id DESC
    `);

    return result.rows;
};

// ============================================================
// ADD RIDER
// ============================================================

exports.addRider = async (
    name,
    phone,
    vehicle_type,
    vehicle_number
) => {

    const result = await pool.query(
        `
        INSERT INTO riders
        (
            name,
            phone,
            vehicle_type,
            vehicle_number,
            status,
            is_active,
            created_at
        )
        VALUES
        ($1, $2, $3, $4, 'Offline', true, CURRENT_TIMESTAMP)
        RETURNING
            id,
            name,
            phone,
            vehicle_type,
            vehicle_number,
            status,
            is_active,
            created_at
        `,
        [
            name,
            phone,
            vehicle_type,
            vehicle_number
        ]
    );

    return result.rows[0];
};

// ============================================================
// UPDATE RIDER
// ============================================================

exports.updateRider = async (
    id,
    name,
    phone,
    vehicle_type,
    vehicle_number
) => {

    const result = await pool.query(
        `
        UPDATE riders
        SET
            name = $1,
            phone = $2,
            vehicle_type = $3,
            vehicle_number = $4
        WHERE id = $5
        RETURNING
            id,
            name,
            phone,
            vehicle_type,
            vehicle_number,
            status,
            is_active,
            created_at
        `,
        [
            name,
            phone,
            vehicle_type,
            vehicle_number,
            id
        ]
    );

    return result.rows[0];
};

// ============================================================
// ACTIVATE / DEACTIVATE RIDER
// ============================================================

exports.updateRiderActiveStatus = async (
    id,
    is_active
) => {

    const result = await pool.query(
        `
        UPDATE riders
        SET is_active = $1
        WHERE id = $2
        RETURNING
            id,
            name,
            phone,
            vehicle_type,
            vehicle_number,
            status,
            is_active,
            created_at
        `,
        [
            is_active,
            id
        ]
    );

    return result.rows[0];
};