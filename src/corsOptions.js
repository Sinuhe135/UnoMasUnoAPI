const cors = require('cors');

let permitedIP = [];

if(process.env.NODE_ENV === 'production')
{
    permitedIP = ['https://urlfinal.com'];
}
else if (process.env.NODE_ENV)
{
    permitedIP = ['http://localhost:5173', 'https://frontunomasuno-test.up.railway.app'];
    
    let numberIP = 0;
    while(numberIP<30)
    {
        permitedIP.push('http://192.168.0.'+numberIP+':5173');
        numberIP++;
    }
}
else
{
    throw ('NODE_ENV has not been set up');
}

const corsOptions = {
    origin: permitedIP,
    credentials: true,
};

module.exports = cors(corsOptions);