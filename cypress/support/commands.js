// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/// <reference types="cypress" />


Cypress.Commands.add('createUser', (dataUser) => {

    return cy.request({
        url:'/users',
        method:'POST',
        failOnStatusCode: false,
        body: dataUser
    });

});

Cypress.Commands.add('loginUser', (dataUser) => {

    
    return cy.request({
        url:'/sessions',
        method:'POST',
        failOnStatusCode: false,
        body: {
            email: dataUser.email,
            password: dataUser.password
        }
    });
} );


Cypress.Commands.add('createTask', (dataTask) => {
 
    return cy.get('@loginToken').then(token => {
       
        return cy.request({
            url: '/tasks',
            method: 'POST',
            failOnStatusCode: false,
            headers: { Authorization: token },
            body: dataTask
        });
    });
     
});

Cypress.Commands.add('deleteTask', (task_id) => {

    cy.get('@loginToken').then(token => {

        return cy.request({
            url: `/tasks/${task_id}`,
            method: 'DELETE',
            failOnStatusCode: false,
            headers: { Authorization: token }
        });
    });
});


Cypress.Commands.add('listTaskBy', (task_id, taskName) => {

    return cy.get('@loginToken').then(token => {

        if(!task_id && !taskName){
            return cy.request({
                url: '/tasks',
                method: 'GET',
                headers: { Authorization: token}
            });
        }else if(task_id){
            return cy.request({
                url: `/tasks/${task_id}`,
                method: 'GET',
                failOnStatusCode: false,
                headers: { Authorization: token}
            });
        }else if(taskName){
            return cy.request({
                url: `/tasks?name=${encodeURIComponent(taskName)}`,
                method: 'GET',
                headers: { Authorization: token}
            });
        }
    });
});

Cypress.Commands.add('taskDoneTodo', (task_id, taskStatus) => {

    cy.get('@loginToken').then(token => {
        return cy.request({
            url: `/tasks/${task_id}/${taskStatus}`,
            method: 'PUT',
            failOnStatusCode: false,
            headers: { Authorization: token}
        });
    });
})

Cypress.Commands.add('setup_initializeUserTasks', (dtUser, dtTask, dtTask2, option={}) => {

    cy.task('deleteUserByEmail', dtUser.email) // via mongodb
    .then(()=> cy.task('deleteAllTasks')) // via mongodb
    .then(()=> cy.createUser(dtUser))
    .then(()=> {
        if(option.skipLogin) return cy.wrap(null)
        return cy.loginUser(dtUser).then(response=> cy.wrap(response.body.token).as('loginToken'))
    })
    .then(()=> dtTask  ? cy.createTask(dtTask).then(response=> cy.wrap(response.body._id).as('task_id')):null)
    .then(()=> dtTask2 ? cy.createTask(dtTask2): null)
});

// initializeUserTasks