let properties = {httpOnly:true,secure:true};

if(process.env.NODE_ENV === 'production')
{
    properties.sameSite = 'lax';
    properties.domain = '.urlfinal.com';
}
else if(process.env.NODE_ENV)
{
    properties.sameSite = 'None';
}
else
{
    throw('NODE_ENV has not been set up')
}

module.exports = properties;