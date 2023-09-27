-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Date" TEXT NOT NULL,
    "restaurantsId" INTEGER NOT NULL,
    CONSTRAINT "Reservations_restaurantsId_fkey" FOREIGN KEY ("restaurantsId") REFERENCES "Restaurants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Reservations" ("Date", "id", "restaurantsId") SELECT "Date", "id", "restaurantsId" FROM "Reservations";
DROP TABLE "Reservations";
ALTER TABLE "new_Reservations" RENAME TO "Reservations";
CREATE INDEX "Reservations_restaurantsId_idx" ON "Reservations"("restaurantsId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
