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

/**
 * Sign a token for the given user id
 * @param userId
 * @return {string}
 */
function getToken(userId) {
    return jwt.sign({
        subject: userId,
        expiresIn: '2d',
        // issuer: 'svgtk-bmat',
        // audience: 'user'
    }, secret);
}

/**
 * Authenticate a user given his/her email and password and generate a token
 * @param email
 * @param password
 * @return {Promise<string>} Resolves with the token on success. Rejects in case authentication was unsuccessful.
 */
async function authenticate(email, password) {
    const user = await model['User'].authenticate(email, password);
    return getToken(user.id);
}

/**
 * A middleware function for the JWT setup
 * @param req
 * @param res
 * @param next
 * @return {Promise<this>}
 */
async function jwtAuthorizationMiddleware(req, res, next) {
    try {
        if (!req.header('Authorization').startsWith('Bearer ')) {
            return res.sendStatus(401);
        }

        const token = req.header('Authorization').replace('Bearer ', '');
        const payload = jwt.verify(token, secret);
        req['user'] = await model['User'].findByPk(payload.subject);

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
