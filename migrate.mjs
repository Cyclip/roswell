import fs from 'fs';
import path from 'path';
import "./server/loadenv.mjs"
import "./server/db/conn.mjs"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const migrationPath = path.join(__dirname, 'migrations');
const migrationFiles = fs.readdirSync(migrationPath).filter((file) => {
    return file.endsWith('.mjs');
});

const runMigration = async (migration) => {
    const migrationModule = await import(
        `./migrations/${migration}`
    );
    await migrationModule.default();
}

const migrate = async () => {
    let failed = 0;

    for (const migration of migrationFiles) {
        try {
            await runMigration(migration);
            console.log(`[${migrationFiles.indexOf(migration) + 1}/${migrationFiles.length}] Migration ${migration} complete`);
        } catch (error) {
            console.log(`[${migrationFiles.indexOf(migration) + 1}/${migrationFiles.length}] Migration ${migration} failed`);
            console.log(error);
            failed++;
        }
    }

    console.log(`Migrations complete. ${migrationFiles.length - failed}/${migrationFiles.length} succeeded.`);
    console.log(`Failed migrations: ${failed}`);
}

migrate();