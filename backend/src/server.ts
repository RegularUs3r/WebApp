require('dotenv').config();

import app from "./app";

const port = 4242

app.listen(port, () => {
    console.log(`App listening on ${port}`)
})