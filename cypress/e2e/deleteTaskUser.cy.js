

describe('Teste de exclusão de tarefa', () => {

    let data;
    beforeEach(() => {
        cy.fixture('users.json').then(user => { data = user; })
        .then(() => cy.task('deleteUserByEmail', data.users.email))
        .then(() => cy.task('deleteAllTasks'))
        .then(() => cy.createUser(data.users))
        .then(() => cy.loginUser(data.users))
        .then(response =>  cy.wrap(response.body.token).as('loginToken'))
        .then(() => cy.createTask(data.task))
        .then(response => cy.wrap(response.body._id).as('task_id'))
    })

    it('Deve excluir uma tarefa', () => {

        cy.get('@task_id').then(taskId => {

            cy.deleteTask(taskId).then(response => { 
                expect(response.status).to.eq(204)
             })
            
        })

    })
})