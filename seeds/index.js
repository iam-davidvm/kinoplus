const mongoose = require('mongoose');
const { db } = require('../models/cinema');
const Cinema = require('../models/cinema');

mongoose
  .connect('mongodb://localhost:27017/kinoplus')
  .then(() => {
    console.log('MONGODB CONNECTED');
  })
  .catch((e) => {
    console.log('WE HAVE AN ERROR:');
    console.log(e);
  });

mongoose.set('strictQuery', false);

const seedDb = async () => {
  await Cinema.deleteMany({});

  /* better to use a for loop */
  const cinema1 = new Cinema({
    name: 'Cinema Central',
    location: 'Ninove',
    description: 'Little, old and scruffy cinema.',
    image:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1450&q=80',
    owner: 'Tania De Haeseleir',
    email: 'hello@cinema-central.be',
    phone: '+3254223344',
  });
  const cinema2 = new Cinema({
    name: 'Palace Aalst',
    location: 'Aalst',
    description: 'Movie theater with not a lot of attendees.',
    image:
      'https://images.unsplash.com/photo-1513015579021-66c7c008af85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fG1vdmllJTIwdGhlYXRlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    owner: 'Alexander Tournedos',
    email: 'info@palace-aalst.be',
    phone: '+3253448899',
  });
  const cinema3 = new Cinema({
    name: 'Bioscoop Focus',
    location: 'Geraardsbergen',
    description: 'Focus on movies',
    image:
      'https://images.unsplash.com/photo-1563381013529-1c922c80ac8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1626&q=80',
    owner: 'Guido Zebra',
    email: 'guido@focus.be',
    phone: '+3254873244',
  });
  const cinema4 = new Cinema({
    name: 'Kinepolis',
    location: 'Brussel',
    description: 'Near the Atomium',
    image:
      'https://images.unsplash.com/photo-1510827220565-c6a086ff31c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    owner: 'Cathérine Dujardin',
    email: 'sales@kinepolis.be',
    phone: '+3225483244',
  });
  await cinema1.save();
  await cinema2.save();
  await cinema3.save();
  await cinema4.save();
};

seedDb().then(() => {
  mongoose.connection.close();
});
