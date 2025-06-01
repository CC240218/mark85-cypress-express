

describe('Teste de criação de usuario via API', () => {
 
  let data;
  beforeEach(() => { 
    cy.fixture('users.json').then(user => {
      data = user;
    });
  });


  context('Create', () => {
    
    it('Deve criar um usuário', () => {
    
      cy.task('deleteUserByEmail', data.users.email)

      cy.createUser(data.users ,{
      }).then(response => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('name');
          expect(response.body).to.have.property('email');
          expect(response.body).to.have.property('password');
          expect(response.body).to.have.property('_id');

          expect(response.body.name).to.eq(data.users.name);
          expect(response.body.email).to.eq(data.users.email);
          expect(response.body.password).to.not.eq(data.users.password);
          expect(response.body._id).to.exist;
          expect(response.body._id).to.be.a('string');

      });
    })
  });

  context('Validation create', () => {

    it('Não deve cadastrar usuário com um email ja cadastrado', () => {

      cy.task('deleteUserByEmail', data.users.email)
      cy.createUser(data.users, {});

      cy.createUser(data.users, {

      }).then(response => {
        expect(response.status).to.eq(409);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.eq(data.err.msnDupl);
      })
    })

    it('Não deve cadastrar usuário com email invalido', () => {

      data.users.email = 'emailinvalido';
      cy.createUser(data.users, data.users.email, {

      }).then(response => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('type');
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.eq(data.err.msnInv);
      });
    });

    it('Não deve cadastrar com o campo name vazio', () => {

      data.users.name = '';
      cy.createUser(data.users, {

      }).then(response => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('type');
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.eq(data.err.namEmpy);
      });
    });

    it('Não deve cadastrar com o campo email vazio', () => {

      data.users.email = '';
      cy.createUser(data.users, {

      }).then(response => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('type');
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.eq(data.err.emlEmpy);
      });
    });

    it('Não deve cadastrar com o campo password', () => {

      data.users.password = '';
      cy.createUser(data.users, {

      }).then(response => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('type');
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.eq(data.err.pwdEmpy);
      });
    });

    it('Não deve permitir campos não planejados no request', () => {

      data.users.extra = 'extraField';
      cy.createUser(data.users, {}).then(response => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.eq(data.err.extra);
      })
    });
  });
})