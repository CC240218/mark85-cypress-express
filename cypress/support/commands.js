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

