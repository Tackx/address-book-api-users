import app from './app';
import mongoose, { MongooseOptions } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const config = process.env;

let appPort: string;
let mongoUrl: string;

if (<string>config.NODE_ENV === 'production') {
  appPort = <string>config.PORT || <string>config.PROD_PORT;
  mongoUrl = <string>config.DB_PROD_URL;
} else {
  appPort = <string>config.PORT || <string>config.DEV_PORT;
  mongoUrl = <string>config.DB_DEV_URL;
}

// Connect to MongoBD
mongoose
  .connect(
    <string>mongoUrl,
    <MongooseOptions>{
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log('Connected to MongoDB');

    // Start API server
    app.listen(appPort, () => {
      console.log(`Users Service Server started on port ${appPort}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
