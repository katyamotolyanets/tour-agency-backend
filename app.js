require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const db = require('./db-connection');

const PORT = process.env.APP_PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('ROOT'));

app.use(require('./routes/api-tour-route'));
app.use(require('./routes/api-hotel-route'));
app.use(require('./routes/api-roomType-route'));
app.use(require('./routes/api-order-route'));
app.use(require('./routes/api-tourFeature-route'));
app.use(require('./routes/api-user-route'));
app.use(require('./routes/api-arrivalDate-route'));
app.use(require('./routes/api-orderRoom-route'));
app.use(require('./routes/locations/api-city-route'));
app.use(require('./routes/locations/api-continent-route'));
app.use(require('./routes/locations/api-country-route'));
app.use(require('./routes/locations/api-destination-route'));
app.use(require('./routes/images/api-countryImage-route'));
app.use(require('./routes/images/api-hotelImage-route'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

db.authenticate()
    .then(() => console.log('Successfully connect to db'))
    .catch(err => console.log('Error: ' + err));