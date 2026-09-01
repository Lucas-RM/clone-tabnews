import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  const isValidMethod = allowedMethods.includes(request.method);
  const dryRun = request.method === "GET";
  let dbClient;

  if (!isValidMethod) {
    return response.status(405).end();
  }

  try {
    dbClient = await database.getNewClient();

    const migrationsResult = await migrationRunner({
      dbClient: dbClient,
      dryRun: dryRun,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });

    if (migrationsResult.length > 0 && !dryRun) {
      return response.status(201).json(migrationsResult);
    }

    return response.status(200).json(migrationsResult);
  } catch (error) {
    return response.status(405).end();
  } finally {
    await dbClient.end();
  }
}
