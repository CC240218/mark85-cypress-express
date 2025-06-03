

describe('Teste de criação de tarefas do ususário', () => {
    /* 
    beforeEach :
    uma ação encadeada da fixure >> função de exclusão do usuário direto no banco mongo
    >> exclusão de todas as tasks via banco mongo >> Criação de usuário via API
    >> Login do usuário criado e captura do seu token com alias
    */
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
        });

        it('deve criar uma tarefa sem tags', () => {

            data.task.tags = []
            cy.createTask(data.task).then(response => {
                expect(response.status).to.eq(201);
                expect(response.body).to.have.property('name');
                expect(response.body).to.have.property('is_done');
                expect(response.body).to.have.property('tags');
                expect(response.body).to.have.property('user');
                expect(response.body).to.have.property('_id');

                expect(response.body.name).to.eq(data.task.name);
                expect(response.body.is_done).to.be.false;
                expect(response.body.tags).to.be.empty
                expect(response.body.user).to.not.be.empty;
                expect(response.body._id).to.not.be.empty;
            })
        })
    });

    context('Validation task', () => {

        it('Não deve cadastrar uma tarefa com nome repetido', () => {

            cy.createTask(data.task)
            cy.createTask(data.task).then(response => {
                expect(response.status).to.eq(409);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.eq(data.err.taskDup);
            })
        })

        it('Não deve cadastrar uma tarefa sem nome', () => {

            data.task.name = ''
            cy.createTask(data.task).then(response => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.eq(data.err.namEmpy);

            })
        })

        it('Não deve cadastrar com campos a mais', () => {

            data.task.extra = 'campo extra';
            cy.createTask(data.task).then(response => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.eq(data.err.extra)
            })
        })
    });

})