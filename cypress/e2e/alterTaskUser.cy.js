
describe('Teste de finalização de tarefa', () => {

    const TASK_DONE = 'done'; // status true da task
    const TASK_TODO = 'todo'; // status false da task
    let data;                 // variavel para receber a fixure

    beforeEach(() => { 
        cy.fixture('users.json').then(user => { data = user })
        .then(() => 
            cy.setup_createTaskForList( data.users, data.task, null)
        );
    });

    context('Task done or todo', () => {

        it('Deve finalizar uma tarefa', () => {
        
            cy.get('@task_id').then(taskId => {

                cy.listTaskBy( taskId ).then(response => { expect(response.body.is_done).to.eq(false)})
                .then(() =>    cy.taskDoneTodo( taskId, TASK_DONE).then(response => {
                expect(response.status).to.eq(204);
            }))
            .then(() => cy.listTaskBy(taskId).then(response => {
                expect(response.body.is_done).to.eq(true);
            }) )
          });
        });

        it('Deve desfazer a finalização de uma tarefa', () => {
        
            cy.get('@task_id').then(taskId => {

                cy.taskDoneTodo( taskId, TASK_DONE)
                .then(() => cy.listTaskBy(taskId).then(response => {
                    expect(response.body.is_done).to.eq(true);
                }) )
                .then(() => cy.taskDoneTodo(taskId, TASK_TODO).then(response => {
                    expect(response.status).to.eq(204);
                }) )
                .then(() => cy.listTaskBy(taskId).then(response => {
                    expect(response.body.is_done).to.eq(false);
                }) )
          });
        });
    });

    context('Validation task done/todo', () => {

        it('Deve apresentar erro ao passar o parametro de status incorreto', () => {

            cy.get('@task_id').then(taskId => {

                let statusErr = 'incorrect_status'
                cy.taskDoneTodo(taskId, statusErr ).then(response => {
                    expect(response.status).to.eq(404);
                    expect(response.headers['content-type']).to.include(data.htmlErr.contType);

                    expect(response.body)
                    .to.include(data.htmlErr.statusNoFound+taskId+'/'+statusErr);

                })
            })
        });

        it('Deve apresentar erro ao não passar o paramentro de status da task', () => {

            cy.get('@task_id').then(taskId => {

                cy.taskDoneTodo(taskId, null).then(response => {
                    expect(response.status).to.eq(404)
                    expect(response.headers['content-type']).to.include(data.htmlErr.contType);

                    expect(response.body).to.include(data.htmlErr.statusNoFound+taskId);

                });
            });
        });

        it('Id da tarefa não pode ter menos de 24 caracteres', () => {

            let _id = '12345678910111213141516';
            cy.taskDoneTodo(_id, TASK_DONE).then(response => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.eq(data.err.IDqtdDOWN);
            });
        });

        it('Id não pode ter mais de 24 caracteres', () => {

            let _id = '1234567891011121314151617'
            cy.taskDoneTodo(_id, TASK_DONE).then(response => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.eq( data.err.IDqtdUP);
            });
        });
    });
});