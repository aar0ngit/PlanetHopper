// Planet Hopper: entry point
// Aaron Tan

require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// run a server locally; on Vercel the exported app is used as a serverless function
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Planet Hopper running at http://localhost:${PORT}`);
    });
}

module.exports = app;
