const express = require("express")
const path = require("path")
const exphbs = require('express-handlebars');
const app = express()
//const hbs = require("hbs")
const LogInCollection = require("./mongodb")
const port = process.env.PORT || 3000

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const templatePath = path.join(__dirname, '../templates')
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))
app.set('view engine', 'hbs')
app.set('views', templatePath)


app.get('/about', (req, res) => {
    res.render('about');
})
// hbs.registerPartials(partialPath)

app.get('/', (req, res) => {
    res.render('index')
})


app.post('/login', (req, res) => {
    res.render('login')
})
app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/contact', (req, res) => {
    res.render('contact')
})


// app.get('/home', (req, res) => {
//     res.render('home')
// })

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking) {
            res.send("User details already exist");
        } else {
            await LogInCollection.create(data);
            res.status(201).render("home", { naming: req.body.name });
        }
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});



app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
        }

        else {
            res.send("incorrect password")
        }


    }

    catch (e) {

        res.send("wrong details")


    }


})



app.listen(port, () => {
    console.log('port connected');
})