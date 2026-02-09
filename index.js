// P2509361
// Aaron Tan
// DIT/FT/1B/08

require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=> {
    console.log(`App listening to port ${PORT}`);
});