import { PrismaClient } from '@prisma/client';
import express from 'express';
import bodyParser from 'body-parser';

interface Restaurants {
  Name: string
  Description: string
  Adress: string 
  Photo: string
}

const app = express();
app.use(bodyParser.json())
const port = 3000;
const prisma = new PrismaClient()
app.use((req, res, next) => {

  // Dominio que tengan acceso (ej. 'http://example.com')
     res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Metodos de solicitud que deseas permitir
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
  // Encabecedados que permites (ej. 'X-Requested-With,content-type')
     res.setHeader('Access-Control-Allow-Headers', '*');
  
  next();
})



app.get('/', async (req, res) => {
  try {
    const allRestaurants = await prisma.restaurants.findMany()
    res.send(allRestaurants);
  } catch (error) {
    res.sendStatus(500)
  }
});

app.post('/',async (req, res) => {
  try {
    const restaurant: Restaurants = req.body
    await prisma.restaurants.create({
      data: {
        Name: restaurant.Name,
        Description: restaurant.Description,
        Adress:  restaurant.Adress,
        Photo: restaurant.Photo
      }
    })
    res.sendStatus(200)  
  } catch (error) {
    res.sendStatus(500)
  }  
})

app.put('/update/:id', async (req, res ) => {
  try {
    const restaurant: Restaurants = req.body
    await prisma.restaurants.update({ where: {
      id: parseInt(req.params.id, 10)
    },
    data: restaurant
    });
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
    console.error(error)
  }
})

app.delete('/delete/:id',async (req, res) => {

  try {
    await prisma.restaurants.delete({
      where: {
        id: Number(req.params.id)
      }
    })
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
    console.error(error)
  }
})
 
app.post('/reservations', async (req, res) => {
  try {
    const date = new Date();
    //RFC 3339 format
    const formatted = date.toISOString().split("T", 1)

    const singleday =  await prisma.reservations.findMany({
      where: {
        Date: {
          startsWith: formatted[0] 
        }
      }
    });

    const perRestaurant = await prisma.reservations.findMany({
      where: {
        Date: {
          startsWith: req.body.Date.split("T", 1)[0]
        },
        restaurantsId: req.body.restaurantsId
      }
    });

    if (perRestaurant.length >= 15) {
      res.status(405).send("max reservations per day for the restaurant achieved");
      return
    }
    if (singleday.length >= 20){
      res.status(405).send("max reservation per day achieved");
      return
    } 
  
    await prisma.reservations.create({
      data: req.body
    });
    res.sendStatus(200); 
  } catch (error) {
    console.error(error)
    res.sendStatus(500);
  }
})

app.get('/reservations',async (req, res) => {
  try {
    const allReservations = await prisma.reservations.findMany()
    res.send(allReservations);
  } catch (error) {
    res.sendStatus(500)
  }
})

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
