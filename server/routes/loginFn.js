/**
 * Created by Nick on 10/18/15.
 */
var passport = require('passport');
var fn = function(req,res,next){
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
            return res.send({ success : false, message : 'authentication failed' });
        }
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.send({ success : true, message : 'authentication succeeded' });
        });
    })(req, res, next);
};

module.exports = fn;