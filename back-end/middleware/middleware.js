var jwt = require('jsonwebtoken')

// // Verify if user as a auth token
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

async function isAdmin(req, res, next) {
    // Verify if user is a admin
    if(req.user.roleId === 1) {
        next();
    } else {
        return res.status(401).jsend.fail({ "result": "the user is not an admin" });
    }
}


module.exports = {isAuth, isAdmin};


