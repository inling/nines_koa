const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/serect_config');

exports.setToken = payload => {
    return jwt.sign(payload, TOKEN_SECRET, { expiresIn: '168h' });
}

exports.verToken = token => {
    return jwt.verify(token.split(' ')[1], TOKEN_SECRET);
}

/**v1.0.0 */
