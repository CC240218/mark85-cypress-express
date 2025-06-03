
describe('Teste de exclusão de tarefa', () => {

    let data;
    beforeEach(() => {
        cy.fixture('users.json').then(user => { data = user; })
        .then(() => cy.task('deleteUserByEmail', data.users.email))
        .then(() => cy.createUser(data.users))
        .then(() => cy.loginUser(data.users))
        .then(response =>  cy.wrap(response.body.token).as('loginToken'))
    })

    it('Deve excluir uma tarefa', () => {})
})