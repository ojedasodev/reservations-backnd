-- CreateTable
CREATE TABLE "Reservations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Date" TEXT NOT NULL,
    "restaurantsId" INTEGER NOT NULL,
    CONSTRAINT "Reservations_restaurantsId_fkey" FOREIGN KEY ("restaurantsId") REFERENCES "Restaurants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
