const { deleteUser, deleteAllTasks } = require("./cypress/support/utils");
//const { insertUser } = require("./cypress/support/utils");


module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3333',
    setupNodeEvents(on, config) {
      on('task', {
        async deleteUserByEmail(email){
          return await deleteUser(email)
        },
        async deleteAllTasks(){
          return await deleteAllTasks()
        }
      });
      /*on('task', {
        async insertUsers(user){
          return await insertUser(user)
        }
      })*/
    
    },
  },
};
