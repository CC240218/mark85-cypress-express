const { deleteUser } = require("./cypress/support/utils");
const { insertUser } = require("./cypress/support/utils");


module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3333',
    setupNodeEvents(on, config) {
      on('task', {
        async deleteUserByEmail(email){
          return await deleteUser(email)
        }
      });
      on('task', {
        async insertUsers(user){
          return await insertUser(user)
        }
      })
      // implement node event listeners here
    },
  },
};
