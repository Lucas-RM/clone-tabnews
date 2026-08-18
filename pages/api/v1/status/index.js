import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const result = await database.query(`
    SELECT
        current_setting('server_version') AS version,
        current_setting('max_connections')::int AS max_connections,
        (
            SELECT count(*)::int
            FROM pg_stat_activity
            WHERE state = 'active'
        ) AS opened_connections;
  `);

  response.status(200).json({
    updated_at: updatedAt,
    version: result.rows[0].version,
    max_connections: result.rows[0].max_connections,
    opened_connections: result.rows[0].opened_connections,
  });
}

export default status;
