require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI // CHAVE DE ACESSO AO BANCO



async function deleteUser(email) {

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('markdb'); // ajuste para o banco
    const collection = db.collection('users'); // ajuste para a coleção

    const result = await collection.deleteOne({ email });
    return result.deletedCount;
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }

}

module.exports = { deleteUser };


/* ------------------------------------------------------------------
função descontinuada, pois o comando CreateUser já está implementado
Mas ficará por aq para fins academicos!
______________
async function insertUser(user) {

const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('markdb'); // ajuste para o banco
    const collection = db.collection('users'); // ajuste para a coleção

    const result = await collection.insertOne(user);
    return result.insertedId;
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }
}
 ______________

----------------------------------------------------------------------*/