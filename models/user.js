const db = require('../util/database');

module.exports = class User {
  constructor(user_id, user_name, user_pass) {
    this.user_id = user_id;
    this.user_name = user_name;
    this.user_pass = user_pass;
  }

  register() {
    return db.execute(
      'INSERT INTO user (user_name, user_pass) VALUES (?, ?)',
      [this.user_name, this.user_pass]
    );
  }

  static login(name, pass) {
    return db.execute(
        'SELECT * from user where user_name = ?',
        [name]
    );
}

static lastSign(name, pass) {
  return db.execute(
      'select * from user where user_name = ? and user_pass = ?',
      [name, pass]
  );
}

static loginAdmin(name, pass) {
    return db.execute(
        'SELECT user_id from user where user_name = ? and user_pass = ?',
        [name, pass]
    );
}

};