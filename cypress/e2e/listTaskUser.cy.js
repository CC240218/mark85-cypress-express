
describe('Teste de retorno da lista de tarefas do usuário', () => {

    let data;
    beforeEach(()=>{
        cy.fixture('users.json').then(user => { data = user })
        .then(() => cy.setup_initializeUserTasks(data.users, data.task, data.task2))
    })

    context('list tasks', () => {

        it('Deve listar todas as tarefas do usuário', () => {

           cy.listTaskBy().then(response => {
                expect(response.status).to.eq(200)
                expect(response.body).to.exist
                expect(response.body).to.length;

                expect(response.body[0].name).to.eq(data.task.name)
                expect(response.body[1].name).to.eq(data.task2.name)
                expect(response.body[0].is_done).to.eq(false)
                expect(response.body[1].is_done).to.eq(false)

                expect(response.body[0].tags[0]).to.eq(data.task.tags[0])
                expect(response.body[0].tags[1]).to.eq(data.task.tags[1])
                expect(response.body[0].tags[2]).to.eq(data.task.tags[2])
                expect(response.body[1].tags).to.be.empty

                expect(response.body[0].user).to.exist
                expect(response.body[0].user).to.not.be.empty
                expect(response.body[0]._id).to.exist
                expect(response.body[0]._id).to.not.be.empty
                expect(response.body[1].user).to.exist
                expect(response.body[1].user).to.not.be.empty
                expect(response.body[1]._id).to.exist
                expect(response.body[1]._id).to.not.be.empty
            });
        })

        it('Deve buscar uma tarefa pelo Id', () => {

            cy.get('@task_id').then(id => {

                cy.listTaskBy(id).then(response => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('_id')
                    expect(response.body).to.have.property('name')
                    expect(response.body).to.have.property('is_done')
                    expect(response.body).to.have.property('tags')
                    expect(response.body).to.have.property('user')

                    expect(response.body.name).to.eq(data.task.name)
                    expect(response.body._id).to.not.be.empty
                    expect(response.body.user).to.not.be.empty
                    expect(response.body.is_done).to.eq(false)
                    expect(response.body.tags[0]).to.eq(data.task.tags[0])
                    expect(response.body.tags[1]).to.eq(data.task.tags[1])
                    expect(response.body.tags[2]).to.eq(data.task.tags[2])
                    
                });
            });
        });

        it('Deve buscar uma tarefa pelo nome de forma generica', () => {

            cy.listTaskBy(null,data.task.name).then(response => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.length.greaterThan(0)
                expect(response.body).to.have.lengthOf(2)
                expect(response.body[0]).to.have.property('_id')
                expect(response.body[0]).to.have.property('name')
                expect(response.body[0]).to.have.property('is_done')
                expect(response.body[0]).to.have.property('tags')
                expect(response.body[0]).to.have.property('user')

                expect(response.body[1]).to.have.property('_id')
                expect(response.body[1]).to.have.property('name')
                expect(response.body[1]).to.have.property('is_done')
                expect(response.body[1]).to.have.property('tags')
                expect(response.body[1]).to.have.property('user')

                expect(response.body[0].name).to.eq(data.task.name)
                expect(response.body[0]._id).to.not.be.empty
                expect(response.body[0].user).to.not.be.empty
                expect(response.body[0].is_done).to.eq(false)

                expect(response.body[1].name).to.eq(data.task2.name)
                expect(response.body[1]._id).to.not.be.empty
                expect(response.body[1].user).to.not.be.empty
                expect(response.body[1].is_done).to.eq(false)
                expect(response.body[1].tags).to.be.empty;

                expect(response.body[0].tags[0]).to.eq(data.task.tags[0])
                expect(response.body[0].tags[1]).to.eq(data.task.tags[1])
                expect(response.body[0].tags[2]).to.eq(data.task.tags[2])
            });
            
        });

        it('Deve buscar uma tarefa de forma absoluta', () => {

            cy.listTaskBy(null, data.task2.name).then(response => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.length.greaterThan(0)
                expect(response.body).to.have.lengthOf(1)

                expect(response.body[0]).to.have.property('_id')
                expect(response.body[0]).to.have.property('name')
                expect(response.body[0]).to.have.property('tags')
                expect(response.body[0]).to.have.property('user')

                expect(response.body[0].name).to.eq(data.task2.name)
                expect(response.body[0]._id).to.not.be.empty
                expect(response.body[0].user).to.not.be.empty
                expect(response.body[0].is_done).to.eq(false)
                
            });
        });

        it('Deve retornar um array vazio ao não encontrar dados da busca', () => {

            data.task.name = 'não encontrado'
            cy.listTaskBy(null, data.task.name).then(response => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.lengthOf(0)
                expect(response.body).to.be.empty
            });
        });
    });

    context.only('Validation list task', () => {

        it('Deve retornar erro ao não encontrar tarefa pelo id', () => {

            data.task._id = '123456789123456789123456'
            cy.listTaskBy(data.task._id).then(response => {
                expect(response.status).to.eq(404)
                expect(response.body).to.be.empty
            });
        });

        it('Deve retornar erro com id abaixo de 24 caracteres', () => {

            data.task._id = '12345678912345678912345'; // 23 caracteres
            cy.listTaskBy(data.task._id).then(response => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.eq(data.err.IDqtdDOWN)
            });
        });

        it('Deve retornar erro com id acima de 24 caracteres', () => {

            data.task._id = '1234567891234567891234567'; // 25 caracteres
            cy.listTaskBy(data.task._id).then(response => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.eq(data.err.IDqtdUP)
            });
        });
    });
});