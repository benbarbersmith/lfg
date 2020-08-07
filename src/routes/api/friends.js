export async function get(req, res, _) {
    if (typeof req.session.user !== 'undefined' && typeof req.session.user.friends !== 'undefined') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ friends: req.session.user.friends }));
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status = 500;
        res.end(JSON.stringify({ error: "Friends and matching games have not yet been retrieved." }));
    }
}