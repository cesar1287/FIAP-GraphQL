const { database } = require('firebase-admin')
const admin = require('firebase-admin')

module.exports = {
    Query:{
        produto:()=>{
            return admin.database()
                   .ref("produtos")
                   .once("value")
                   .then(snap => snap.val())
                   .then(val => Object.keys(val)
                   .map((key)=>val[key]))
        }
    },
    Mutation:{
        novoProduto(_,{id,nomeproduto,descricao,fornecedor,preco,datacadastro}){
            const novo = {
            id:id,
            nomeproduto:nomeproduto,
            descricao:descricao,
            fornecedor:fornecedor,
            preco:preco,
            datacadastro:datacadastro
        }
        admin.database()
        .ref("produtos")
        .push(novo)
        
        return admin.database()
                   .ref("produtos")
                   .limitToLast(1)
                   .once("value")
                   .then(snap => snap.val())
                   .then(val => Object.keys(val)
                   .map((key)=>val[key]))
        },
        deletarProduto(_,{id}) {
            const databaseelement = admin.database().ref("produtos")
            return databaseelement
              .orderByChild("id")
              .equalTo(id)
              .once("value")
              .then((snap) => {
                return snap.val();
              })
              .then((val) => {
                if (val != null) {
                  const elementoSelecionado = Object.keys(val)[0];
                  const produtoExcluido = val[elementoSelecionado];
                  databaseelement.child(elementoSelecionado).remove();
                  return produtoExcluido;
                } 
              })
        },
        alteraProduto(_,{id,nomeproduto,descricao,fornecedor,preco,datacadastro}) {
          const databaseelement = admin.database().ref("produtos");
          return databaseelement
            .orderByChild("id")
            .equalTo(id)
            .once("value")
            .then((snap) => {
              return snap.val()
            })
            .then((val) => {
              if (val) {
                const elementoSelecionado = Object.keys(val)[0]
                let produtoRef = val[elementoSelecionado]
                produtoRef.nomeproduto = nomeproduto
                produtoRef.descricao = descricao
                produtoRef.fornecedor = fornecedor
                produtoRef.preco = preco
                produtoRef.datacadastro = datacadastro
    
                console.log("produtoAlterado", produtoRef)
    
                databaseelement.child(elementoSelecionado).set(produtoRef)
                return produtoRef
              }
            })
        }
    }
}