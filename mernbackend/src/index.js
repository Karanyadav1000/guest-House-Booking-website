const express = require("express")
const path = require("path")
const app = express()
const LogInCollection = require("./mongodb")
const UserDetails = require("./userDetails"); // Import the UserDetails model
const Room = require("./roomModel");

const port = process.env.PORT || 3000

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

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/home', (req, res) => {
    res.render('index')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.all('/signup', async (req, res) => {
    if (req.method === 'GET') {
        res.render('signup');
    } else if (req.method === 'POST') {
        const data = {
            name: req.body.name,
            password: req.body.password
        };

        try {
            const checking = await LogInCollection.findOne({ name: { $regex: new RegExp("^" + req.body.name, "i") } });

            if (checking) {
                res.send("User details already exist");
            } else {
                await LogInCollection.create(data);
                res.status(201).render("index", { naming: req.body.name });
            }
        } catch (error) {
            res.status(500).send("Error: " + error.message);
        }
    }
});

app.all('/login', async (req, res) => {
    if (req.method === 'GET') {
        res.render('login');
    } else if (req.method === 'POST') {
        try {
            const check = await LogInCollection.findOne({ name: req.body.name })

            if (check.password === req.body.password) {
                res.status(201).render("details", { naming: `${req.body.password}+${req.body.name}` })
            } else {
                res.send("incorrect password")
            }
        } catch (e) {
            res.send("wrong details")
        }
    }
});

app.post('/submit', async (req, res) => {
    const userData = {
        name: req.body.name,
        roll: req.body.roll,
        mobile: req.body.mobile,
        guests: req.body.guests,
        checkin: req.body.checkin,
        checkout: req.body.checkout
    };

    try {
        const availableRooms = await Room.find({ availability: true });

        if (availableRooms.length === 0) {
            return res.status(400).send("No available rooms");
        }

        const randomIndex = Math.floor(Math.random() * availableRooms.length);
        const selectedRoom = availableRooms[randomIndex];

        userData.roomNumber = selectedRoom.roomNumber;

        await UserDetails.create(userData);

        await Room.findByIdAndUpdate(selectedRoom._id, { availability: false });

        res.render('confirmation', { name: req.body.name, roomNumber: selectedRoom.roomNumber });

        // Update user's room number
        await UserDetails.findOneAndUpdate({ name: req.body.name }, { roomNumber: selectedRoom.roomNumber });
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

app.listen(port, () => {
    console.log('port connected');
})
