var jwt = require('jsonwebtoken')

// Middleware function to determine if the API endpoint request is from an authenticated user
function isAuth(req, res, next) {
    // I use req.cookies.authorization 
    // as well as req.headers to store the token,
    // so i can handle the token in the frontend app
    
    let token;
    // if token is a cookie
    if(req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    } else if(req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).jsend.fail({ "result": "JWT token not provided" });
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!decodedToken) {
            return res.status(401).jsend.fail({ "result": "JWT token is invalid" });
        }
        req.user = decodedToken
        next(); 
    } catch (err) {
        return res.status(401).jsend.fail({ "result": "JWT token is invalid or expired" });
    }
}

module.exports = isAuth;

