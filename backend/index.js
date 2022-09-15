const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');
const { fillDayCollection } = require('./seed/day.seed');
const { fillAdmin } = require('./seed/admin.seed');

// Create server
const app = express();

// Database connection
dbConnection();

// Seeders
fillAdmin();
fillDayCollection();

// settings
app.set('Port', process.env.PORT);

// middlewares
app.use(cors({ origin: 'http://localhost:4200' }));

app.use(express.json());

// routes

// //VALIDAR EL JWT EN CADA RUTA
// app.use('/api/users',require('./routes/user.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/states', require('./routes/state.routes'));
app.use('/api/cities', require('./routes/city.routes'));
app.use('/api/patients', require('./routes/patient.routes'));
app.use('/api/pathologies', require('./routes/pathology.routes'));

// start server
app.listen(app.get('Port'), () => {
  console.log(`Server on port: ${app.get('Port')}`);
});
