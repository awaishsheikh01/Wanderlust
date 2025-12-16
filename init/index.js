const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

//connection
const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';
main()
  .then(() => {
    console.log('Connectec to DB');
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '693db25c64ee09161d476c18',
  }));
  await Listing.insertMany(initData.data);
  console.log('data was initialized');
};

initDB();
