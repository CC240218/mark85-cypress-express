
describe('Teste de login via API', () => {

    let data;
    beforeEach(() => { 
        cy.fixture('users.json').then(user => {
            data = user;
        });
    });

    context('Login', () => {
        
        it('Deve logar o usuário', () => {

            cy.loginUser(data.users, {}).then(response => {
                expect(response.status).to.eq(200);
                expect(response.body).to.not.empty;
                expect(response.body).to.have.property('user');
                expect(response.body.user).to.have.property('_id');
                expect(response.body.user).to.have.property('name');
                expect(response.body.user).to.have.property('email');
                expect(response.body.user).to.have.property('password');
                expect(response.body).to.have.property('token');
                expect(response.body.token).to.not.empty;
                expect(response.body).to.have.property('expires_in');

                expect(response.body.user._id).to.exist;
                expect(response.body.user.name).to.eq(data.users.name);
                expect(response.body.user.email).to.eq(data.users.email);
                expect(response.body.user.password).to.not.eq(data.users.password);
                expect(response.body.expires_in).to.eq('10d');

            cy.wrap(response.body.token).as('token');

            });
            
        });
    });

    context('Validation Login', () => {

        it('Não deve logar usuário não cadastrado. Versão email', () => {

            data.users.email = 'teste@emailerr.com';
            cy.loginUser(data.users, {}).then(response => {
                expect(response.status).to.eq(401);
                expect(response.body).to.not.exist;
            });

        });

        it('Não deve logar usuário não cadastrado. Versão senha', () => {

            data.users.password = 'senhaerrada';
            cy.loginUser(data.users, {}).then(response => {
                expect(response.status).to.eq(401);
                expect(response.body).to.not.exist;
            });

        });

        it('Nao deve cadastrar com email inválido', () => {
            data.users.email = 'emailinvalido';
            cy.loginUser(data.users, {}).then(response => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('type');
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.eq(data.err.msnInv);
            });

        });

        it('Não deve cadastrar com email vazio', () => {

            data.users.email = '';
            cy.loginUser(data.users, {}).then(response => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('type');
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.eq(data.err.emlEmpy);
            });

        });

        it('Não deve cadastrar com senha vazia', () => {
            data.users.password = '';
            cy.loginUser(data.users, {}).then(response => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('type');
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.eq(data.err.pwdEmpy);
            });
        });

    });

})