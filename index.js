const express = require('express');
const app = express();
const fs = require('fs');
const moviesdb = JSON.parse(fs.readFileSync('./moviesdb.json', 'utf-8'));


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST,PUT,DELETE");
    next();
});

app.use(express.json());



////////////////////////// MOVIES ///////////////////////

// all movies

app.get('/movies', (req, res) => {
    res.send(moviesdb);
})

// id movies
app.get('/movies/id', (req, res) => {

    const idMovies = req.body;
    const foundIdMovies = moviesdb.movies.find(movies => movies.idFilms === idMovies.idFilms);

    if (foundIdMovies) {
        res.status(200).send(foundIdMovies);
    } else {
        res.status(400).send('id no encontrado');
    }
})


// genre movies

app.post('/movies/genre', (req, res) => {

    const genreMovies = req.body;
    const fundGenreMovies = moviesdb.movies.filter(movies => movies.genre === genreMovies.genre);

    if (fundGenreMovies) {
        res.status(200).send(fundGenreMovies);
    } else {
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
            existentUser.username === user.username &&
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


app.get('/profile/id/:id', (req, res) => {

    const usersdb = JSON.parse(fs.readFileSync('./users.db.json', 'utf-8'));
    const idUsers = req.params.id;
    const foundIdUser = usersdb.users.find(users => users.id === parseInt(idUsers));

    if (foundIdUser) {
        res.status(200).send(foundIdUser);
    } else {
        res.status(401).send('user no encontrado');
    }

})


////////////////////////// PEDIDOS ///////////////////////


app.post('/order', (req, res) => {


    const idUsers = req.body;
    const usersdb = JSON.parse(fs.readFileSync('./users.db.json', 'utf-8'));
    const foundUser = usersdb.users.find(existentUser => existentUser.id === idUsers.id)

    const moviesdb = JSON.parse(fs.readFileSync('./moviesdb.json', 'utf-8'));
    const foundMovie = moviesdb.movies.find(movies => movies.idFilms === idUsers.idFilms)



    if (foundUser) {

        if (foundMovie) {

            // Crea fecha de alquiler y fecha para devolver
            const date = new Date();
            const todayDate = date.getDay() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            const returnDate = ((date.getDay() + 5) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());

            foundUser.todayDate = todayDate;
            foundUser.returnDate = returnDate;

            // Inserta en la bd de user el id y título de la peli 
            foundUser.idFilms = foundMovie.idFilms;
            foundUser.title = foundMovie.title;

            fs.writeFileSync('./users.db.json', JSON.stringify(usersdb, null, 2));
            res
                .status(200)
                .json('valido')
        } else {
            res.status(401).json('no valido user');
        }

    } else {
        res.status(401).json('no valido movie');
    }


})




//start server

app.listen(3000, () => console.log("app listening in localhost:3000"));