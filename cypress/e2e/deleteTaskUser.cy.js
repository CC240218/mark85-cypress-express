


describe('Teste de exclusão de tarefa', () => {

    let data;
    beforeEach(() => {
        cy.fixture('users.json').then(user => { data = user; })
        .then(()=> cy.setup_createTaskForList(data.users, data.task, null));
        
    })

    context('Delete task', () => {

        it('Deve excluir uma tarefa', () => {

            cy.get('@task_id').then(taskId => {

                cy.listTaskBy(taskId).then(response => {
                    expect(response.body._id).to.not.be.empty
                })
                .then(() =>  cy.deleteTask(taskId).then(response => { 
                    expect(response.status).to.eq(204)
                }))
                .then(() => cy.listTaskBy(taskId).then(response => {
                    expect(response.status).to.eq(404)
                }));
            });
        });
    });

    context('Validation delete task', () => {

        it('Deve retornar erro ao não encontrar a tarefa para excluir', () => {

            data.task._id = '123456789123456789123456'; // 24 caracteres
            cy.deleteTask(data.task._id).then(response => {
                expect(response.status).to.eq(404);
                expect(response.body).to.have.lengthOf(0)
            });
        });

        it('Deve retornar erro com id abaixo de 24 caracteres', () => {

            data.task._id = '12345678912345678912345'; // 23 caracteres
            cy.deleteTask(data.task._id).then(response => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.eq(data.err.IDqtdDOWN)
            });
        });

        it('Deve retornar erro com id acima de 24 caracteres', () => {

            data.task._id = '1234567891234567891234567'; // 25 caracteres
            cy.deleteTask(data.task._id).then(response => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.eq(data.err.IDqtdUP)
            });
        });
    });
});