"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const port = 3000;
const prisma = new client_1.PrismaClient();
app.use((req, res, next) => {
    // Dominio que tengan acceso (ej. 'http://example.com')
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Metodos de solicitud que deseas permitir
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allRestaurants = yield prisma.restaurants.findMany();
        res.send(allRestaurants);
    }
    catch (error) {
        res.sendStatus(500);
    }
}));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = req.body;
        yield prisma.restaurants.create({
            data: {
                Name: restaurant.Name,
                Description: restaurant.Description,
                Adress: restaurant.Adress,
                Photo: restaurant.Photo
            }
        });
        res.sendStatus(200);
    }
    catch (error) {
        res.sendStatus(500);
    }
}));
app.put('/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = req.body;
        yield prisma.restaurants.update({ where: {
                id: parseInt(req.params.id, 10)
            },
            data: restaurant
        });
        res.sendStatus(200);
    }
    catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}));
app.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.restaurants.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        res.sendStatus(200);
    }
    catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}));
app.post('/reservations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        //RFC 3339 format
        const formatted = date.toISOString().split("T", 1);
        const mockReservation = {
            Date: date.toISOString(),
            restaurantsId: 1
        };
        console.log(mockReservation);
        const singleday = yield prisma.reservations.findMany({
            where: {
                Date: {
                    startsWith: formatted[0]
                }
            }
        });
        console.log(singleday.length);
        const perRestaurant = yield prisma.reservations.findMany({
            where: {
                Date: {
                    startsWith: mockReservation.Date.split("T", 1)[0]
                },
                restaurantsId: 1
            }
        });
        console.log(perRestaurant.length);
        if (perRestaurant.length >= 15) {
            res.status(500).send("max reservations per day for the restaurant achieved");
            return;
        }
        if (singleday.length >= 20) {
            res.status(500).send("max reservation per day achieved");
            return;
        }
        // await prisma.reservations.create({
        //   data: req.body
        // })
        yield prisma.reservations.create({
            data: mockReservation
        });
        res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}));
app.get('/reservations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allReservations = yield prisma.reservations.findMany();
        res.send(allReservations);
    }
    catch (error) {
        res.sendStatus(500);
    }
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map