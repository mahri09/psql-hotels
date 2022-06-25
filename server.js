const express = require ('express');
const app = express();
const  {Pool}= require('pg');

app.use(express.json());

const pool = new Pool({ 
    // give your username
    user: 'mahri',
    host: 'localhost', 
    // change the database name accordingly
    database: 'cyf_hotels',
    password: 'Hatyja-09',
    // Port number
    port: 5432,

    connectionString: process.env.PORT||3000,
    ssl: {
    rejectUnauthorized: false
    }
  })


app.get('/customers', (req, res)=>{
    pool.query('SELECT * FROM customers ORDER BY id' )
    .then ((result)=>res.json(result.rows))
    .catch((error)=>{
        console.log(error)
        res.status(500).json(error);
    })
})

app.get('/hotels', (req, res)=>{
    pool.query('SELECT * FROM hotels ORDER BY name' )
    .then ((result)=>res.json(result.rows))
    .catch((error)=>{
        console.log(error)
        res.status(500).json(error);
    })
})

app.get('/hotels/:id', (req, res)=>{
    let userID = parseInt(req.params.id)
    pool.query(`SELECT * FROM hotels WHERE id=${userID};`)
    .then ((result)=>res.json(result.rows))
    .catch((error)=>{
        console.log(error)
        res.status(500).json(error);
    })
})


app.post("/hotels", function (req, res) {
    const newHotelName = req.body.name;
    const newHotelRooms = req.body.rooms;
    const newHotelPostcode = req.body.postcode;
  
    if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
      return res
        .status(400)
        .send("The number of rooms should be a positive integer. Found " + req.body);
    }
  
    pool
      .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
      .then((result) => {
        if (result.rows.length > 0) {
          return res
            .status(400)
            .send("An hotel with the same name already exists!");
        } else {
          const query =
            "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
          pool
            .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
            .then(() => res.send("Hotel created!"))
            .catch((error) => {
              console.error(error);
              res.status(500).json(error);
            });
        }
      });
  });

  app.put('/customers/:customerId', (req, res)=>{
    const id= parseInt(req.params.customerId)
    const {name,email, address }= req.body
  
    pool.query('UPDATE customers SET name =$1, email= $2, address=$3 WHERE id = $4',[name,email,address,id])  
    .then (()=>{
        res.json( `Customer ${customerId} updated`)
        console.log( `Customer ${customerId} updated`)
    }
        )
    .catch((error)=>{
        console.log(error)
        res.status(500).json(error);
    })
})



app.delete('/customers/:customerId', (req, res)=>{
    const customerId= parseInt(req.params.customerId)
  
    pool.query('DELETE FROM customers WHERE id = $1', [customerId])  
    .then (()=>res.send( `Customer ${customerId} deleted`))
    .catch((error)=>{
        console.log(error)
        res.status(500).json(error);
    })
})




const port = process.env.PORT || 3000;



app.listen(port, ()=> {
console.log('HEY we are listening in ' +port)
})

