const express = require('express');
const app = express();
const fs = require('fs');
const moviesdb = JSON.parse(fs.readFileSync('./moviesdb.json', 'utf-8'));




app.use(express.json());



////////////////////////// MOVIES ///////////////////////

// all movies

app.get('/movies', (req, res) => {
    res.send(moviesdb);
})

// id movies
app.get('/movies/id', (req, res) => {
    
    const idMovies = req.body;
    const foundIdMovies = moviesdb.movies.find(movies => movies.id === idMovies.id);

    if (foundIdMovies){
        res.status(200).send(foundIdMovies);
    } else {
        res.status(400).send('id no encontrado');
    }  
})


// genre movies

app.get('/movies/genre', (req, res) => {

    const genreMovies = req.body;
    const fundGenreMovies = moviesdb.movies.find(movies => movies.genre === genreMovies.genre);

    if (fundGenreMovies){
        res.status(200).send(fundGenreMovies);
    }else {
        res.status(400).send('genero no encontrado')
    }
})


////////////////////////// USER ///////////////////////

// registro usuario

app.post("/register", (req, res) => {

    const user = req.body
    const userdb = JSON.parse(fs.readFileSync('./users.db.json', 'utf-8'));

    const longitudPattern = /.{8,}/ // contraseña mínimo de 8  

    if (!longitudPattern.test(user.password)) {
        return res
       .status(400)
       .json({ message: `password too short` });
    }

    const userExists = userdb.users.some( //comprueba que el usuario no exista
        existentUser => existentUser.email === user.email,
    );

    if (userExists) {  
        return res
        .status(400)
        .json({ message: `email ${user.email}  already exists` });
    }

    user.id = userdb.users.length + 1; //genera id desde el núm 1
    userdb.users.push(user);

    fs.writeFileSync('./users.db.json', JSON.stringify(userdb, null, 2));

    res.status(200).json(user);
})



// login user

app.post("/login", (req, res) => {

    const { generateId } = require('./token.js');

    const user = req.body;
    const userdb = JSON.parse(fs.readFileSync('./users.db.json', 'utf-8'));
  
    const foundUser = userdb.users.find(
      existentUser =>
        existentUser.email === user.email &&
        existentUser.password === user.password,
    );
  
    if (foundUser) {
      const token = generateId();
  
      foundUser.token = token;
  
      fs.writeFileSync('./users.db.json', JSON.stringify(userdb, null, 2));
      res
        .status(200)
        .json({ message: `valid login`, user: foundUser });
    } else {
      res.status(401).json({ message: `invalid login` });
    }
  })


// profile user


app.get('/profile/id',  (req, res) => {

    const usersdb = JSON.parse(fs.readFileSync('./users.db.json', 'utf-8'));

    const idUsers = req.body;
    const foundIdUser = usersdb.users.find(users => users.id === idUsers.id);

    if (foundIdUser) {
        res.status(200).send(foundIdUser);
      } else {
        res.status(204).send('user no encontrado');
      }

})


////////////////////////// PEDIDOS ///////////////////////

// pedir movie 


















//start server

app.listen(3000, () => console.log("app listening in localhost:3000"));






















 //Conexión a MongoDB

// mongoose.connect('mongodb://localhost:27017/', 
//         {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useCreateIndex:true
//         })
//     .then(() => console.log('conectado a mongodb'))
//     .catch(error => console.log('Error al conectar a MongoDB ' + error));


//Listening server

// app.listen(3000, () => {
//     console.log('server on port 3000');
// })