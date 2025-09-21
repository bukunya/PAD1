-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'MAHASISWA',
    "nim" TEXT,
    "prodi" TEXT,
    "departemen" TEXT DEFAULT 'Departemen Teknik Elektro dan Informatika',
    "telepon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "departemen", "email", "emailVerified", "id", "image", "name", "nim", "prodi", "role", "telepon", "updatedAt") SELECT "createdAt", "departemen", "email", "emailVerified", "id", "image", "name", "nim", "prodi", "role", "telepon", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_nim_key" ON "User"("nim");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
