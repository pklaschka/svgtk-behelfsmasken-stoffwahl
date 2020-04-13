const jwt = require('jsonwebtoken');
const model = require('@alias/model');

let secret = process.env.JWT_SECRET;

if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV !== 'production') {
        secret = 'secret'
    } else {
        console.error(`JWT_SECRET has to exist in `
            + `a production environment, but wasn't set.`);
        process.exit(2);
    }
}

function getToken(subject) {
    return jwt.sign({
        subject,
        expiresIn: '2d',
        // issuer: 'svgtk-bmat',
        // audience: 'user'
    }, secret);
}

async function authenticate(email, password) {
    const user = await model.User.authenticate(email, password);
    return getToken(user.id);
}

async function jwtAuthorizationMiddleware(req, res, next) {
    try {
        if (!req.header('Authorization').startsWith('Bearer ')) {
            return res.sendStatus(401);
        }

        const token = req.header('Authorization').replace('Bearer ', '');

        console.log(1);

        const payload = jwt.verify(token, secret);

        console.log(2);

        req['user'] = await model.User.findByPk(payload.subject);

        if (!req.user) {
            return res.sendStatus(403);
        } else {
            next();
        }
    } catch (e) {
        return res.sendStatus(401);
    }
}

module.exports = {
    jwtAuthorizationMiddleware, authenticate
}
