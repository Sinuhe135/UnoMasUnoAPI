const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routesIndex');
const response = require('./utils/responses');
const cookieParser = require('cookie-parser');
const deleteExpiredSessions = require('./utils/expiredSessions');
const httpsServer = require('./httpsServer.js');

app.use(express.json());
app.use(cookieParser());

// delete on production
let numberIP = 0;
let permitedIP = ['http://localhost:5173'];
while(numberIP<30)
{
    permitedIP.push('http://192.168.0.'+numberIP+':5173');
    numberIP++;
}

const corsOptions = {
    origin: permitedIP,
    credentials: true,
};

app.use(cors(corsOptions));

app.use(router);

app.all('*', (req,res,next)=>{
    response.error(req,res,`No se encuentra ${req.method} ${req.originalUrl} en el servidor`,404);
});

deleteExpiredSessions();

httpsApp = httpsServer(app);

const port = process.env.PORT || 3000;
httpsApp.listen(port, () => console.log(`Escuchando puerto ${port}...`));