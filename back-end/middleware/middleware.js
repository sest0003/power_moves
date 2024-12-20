var jwt = require('jsonwebtoken')

// Middleware function to determine if the API endpoint request is from an authenticated user
function isAuth(req, res, next) {

    const token = req.headers.authorization?.split(' ')[1]; 
    
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
module.exports = isAuth;

