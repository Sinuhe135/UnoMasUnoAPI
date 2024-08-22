const express = require('express');
const app = express();
const router = require('./routesIndex');
const response = require('./utils/responses');
const cookieParser = require('cookie-parser');
const deleteExpiredSessions = require('./utils/expiredSessions');
const httpsServer = require('./httpsServer.js');

app.use(express.json());
app.use(cookieParser());

app.use(router);

app.all('*', (req,res,next)=>{
    response.error(req,res,`No se encuentra ${req.method} ${req.originalUrl} en el servidor`,404);
});

deleteExpiredSessions();

httpsApp = httpsServer(app);

const port = process.env.PORT || 3000;
httpsApp.listen(port, () => console.log(`Escuchando puerto ${port}...`));