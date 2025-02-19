const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Get token from header or cookies
        const token = req.header('Authorization')?.replace('Bearer ', '') || 
                     req.cookies.token;

        if (!token) {
            return res.status(401).redirect('/auth/login');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.clearCookie('token');
            return res.status(401).redirect('/auth/login');
        }
    } catch (error) {
        res.status(500).json({ error: 'Authentication error' });
    }
};

module.exports = auth; 