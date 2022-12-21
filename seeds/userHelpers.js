module.exports.users = [
  {
    username: 'admin',
    email: 'admin@admin.be',
    password: 'admin',
    roles: ['admin'],
  },
  {
    username: 'cinema',
    email: 'cinema@cinema.be',
    password: 'cinema',
    roles: ['cinemaAuthor'],
  },
  {
    username: 'both',
    email: 'both@both.be',
    password: 'both',
    roles: ['cinemaAuthor', 'admin'],
  },
  {
    username: 'dummy',
    email: 'dummy@dummy.be',
    password: 'dummy',
    roles: [],
  },
];
