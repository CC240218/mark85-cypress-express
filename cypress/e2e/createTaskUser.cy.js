
describe('Teste de criação de tarefas do ususário', () => {

    let data;
    beforeEach(() => {
        cy.fixture('users.json').then(user => {
            data = user;
        })
        .then(() =>  cy.task('deleteUserByEmail', data.users.email))
        .then(() =>  cy.createUser(data.users))
        .then(() =>  cy.loginUser(data.users))
        .then(response =>  cy.wrap(response.body.token).as('loginToken'));
    
    });

    context('Create task', () => {

        it('Deve criar uma tarefa', () => {

            cy.createTask(data.task).then(response => {
                expect(response.status).to.eq(201)
            })
        })
    });

})