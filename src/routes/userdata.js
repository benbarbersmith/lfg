export async function get(req, res, next) {
    // the `slug` parameter is available because this file
    // is called [slug].json.js
    const { slug } = req.params;

    if (article !== null) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(article));
    } else {
        next();
    }
}