const express = require ('express');
require('dotenv').config();
// const { dbConnection } = require ('./database/config');
const cors = require ('cors')

//Create server
const app = express();

//Database connection  
dbConnection();


//settings
app.set('Port',process.env.PORT);

//middlewares
app.use(cors({origin:'http://localhost:4200'}));

app.use(express.json());

//routes

// //VALIDAR EL JWT EN CADA RUTA   
// app.use('/api/users',require('./routes/user.routes'));
// app.use('/api/sports',require('./routes/sport.routes'));
// app.use('/api/services',require('./routes/service.routes'));
// app.use('/api/features',require('./routes/feature.routes'));
// app.use('/api/favorites',require('./routes/favorites.routes'));
// app.use('/api/requests',require('./routes/request.routes'));
// app.use('/api/sportcenters',require('./routes/sportCenter.routes'));
// app.use('/api/schedules',require('./routes/schedule.routes'));
// app.use('/api/login',require('./routes/auth.routes'))
// app.use('/api/fields',require('./routes/field.routes'));
// app.use('/api/appointments',require('./routes/appointment.routes'));
// app.use('/api/uploads',require('./routes/upload.routes'));
// app.use('/api/payments',require('./routes/payment.routes'));
// app.use('/api/debts',require('./routes/debt.routes'));
// app.use('/api/reports',require('./routes/report.routes'));

//start server
app.listen(app.get('Port'),()=>{
    console.log(`Server on port: ${app.get('Port')}`)
});