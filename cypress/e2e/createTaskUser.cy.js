

describe('Teste de criação de tarefas do ususário', () => {

    let data;
    beforeEach(() => {
        cy.fixture('users.json').then(user => {
            data = user;
        })
        .then(() =>  cy.task('deleteUserByEmail', data.users.email))
        .then(() =>  cy.task('deleteAllTasks'))
        .then(() =>  cy.createUser(data.users))
        .then(() =>  cy.loginUser(data.users))
        .then(response =>  cy.wrap(response.body.token).as('loginToken'));
    
    });

    context('Create task', () => {

        it('Deve criar uma tarefa', () => {

            cy.createTask(data.task).then(response => {
                expect(response.status).to.eq(201);
                expect(response.body).to.have.property('name');
                expect(response.body).to.have.property('is_done');
                expect(response.body).to.have.property('tags');
                expect(response.body).to.have.property('user');
                expect(response.body).to.have.property('_id');

                expect(response.body.name).to.eq(data.task.name);
                expect(response.body.is_done).to.be.false;
                expect(response.body.tags[0]).to.eq(data.task.tags[0]);
                expect(response.body.tags[1]).to.eq(data.task.tags[1]);
                expect(response.body.tags[2]).to.eq(data.task.tags[2]);
                expect(response.body.user).to.not.be.empty;
                expect(response.body._id).to.not.be.empty;



            })
        })
    });

})