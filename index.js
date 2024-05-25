import express from 'express';
import path from 'path'
import session from 'express-session';

const host = '0.0.0.0';
const porta = 3000;

const app = express();

app.listen(porta, host, () => {
    console.log('projeto aberto');
});


let usuarioAutenticado = false;

app.use(express.static(path.join(process.cwd(), 'publico')));
app.use(express.urlencoded({ extended: true }));

app.use (session({
    secret: '102030',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000*60*60*24
    }
}))


app.use(usuarioEstaAutenticado, express.static(path.join(process.cwd(), 'protegido')));


//verifica autenticação
function usuarioEstaAutenticado (requisicao, resposta, next){
    if (requisicao.session.usuarioAutenticado){
        next ();

    }
    else {
        resposta.redirect ('/login.html')
    }
}

let listaProdutos = [];

function cadastrarProduto(requisicao, resposta) {
    const nome = requisicao.query.nome;
    const tipo = requisicao.query.tipo;
    const descricao = requisicao.query.descricao;
    const cidade = requisicao.query.cidade;
    const estado = requisicao.query.estado;

    if (nome && tipo && descricao && cidade && estado) {
        listaProdutos.push({
            nome: nome,
            tipo: tipo,
            descricao: descricao,
            cidade: cidade,
            estado: estado,
        })
        resposta.redirect ('/listarProdutos')
    }
    else {
        resposta.write(`<!DOCTYPE html>
                        <html lang="en">

                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Aula 3 formulario</title>
                            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
                                integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
                        </head>

                        <body>

                            <div class="container m-5">
                                <legend>Cadastro de Produtos</legend>

                                <form method="POST" action='/cadastrarProdutos' class="border">
                                    <div class="ml-5 mr-5 mb-5 mt-5">
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="nome">Nome do Produto</label>
                                                <input name="nome" type="text" class="form-control" id="nome" placeholder="Nome do produto">`);
        if (nome == undefined) {
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Nome não preenchido. Preencha o nome do produto corretamente!
                            </div>`);
        }
        resposta.write(`</div>
                        <div class="form-group col-md-6">
                            <label for="tipo">Tipo</label>
                            <input type="text" class="form-control" id="tipo" name="tipo"
                                placeholder="Industrializado, artesanal, etc.">`);
        if (tipo == undefined) {
            resposta.write(`<div class="alert alert-danger" role="alert">
                              Tipo não preenchido. Preencha o tipo do produto corretamente!
                            </div>`);
        }
        resposta.write(`</div>
                        </div>
                        <div class="form-group">
                            <label for="descricao">Descrição</label>
                            <input type="text" class="form-control" id="descricao" name="descricao"
                                placeholder="Breve descrição com palavras chave do produto">`);
        if (descricao == undefined) {
            resposta.write(`<div class="alert alert-danger" role="alert">
                              descrição não preenchida. Preencha a descrição do produto corretamente!
                            </div>`);
        }
        resposta.write(`</div>
                        <h2>Origem: </h2>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="cidade">Cidade</label>
                                <input type="text" class="form-control" name="cidade" id="cidade">
        `);
        if (cidade==undefined) {
            resposta.write(`<div class="alert alert-danger" role="alert">
                              cidade não preenchida. Preencha a cidade de origem corretamente!
                            </div>`);
        }
        resposta.write(`</div>
                        <div class="form-group col-md-4">
                            <label for="estado">Estado</label>
                            <select id="estado" name="estado" class="form-control">
                                <option value="" selected>Escolher...</option>
                                <option value="Acre">Acre</option>
                                <option value="Alagoas">Alagoas</option>
                                <option value="Amapá">Amapá</option>
                                <option value="Amazonas">Amazonas</option>
                                <option value="Bahia">Bahia</option>
                                <option value="Ceará">Ceará</option>
                                <option value="Distrito Federal">Distrito Federal</option>
                                <option value="Espírito Santo">Espírito Santo</option>
                                <option value="Goiás">Goiás</option>
                                <option value="Maranhão">Maranhão</option>
                                <option value="Mato Grosso">Mato Grosso</option>
                                <option value="Mato Grosso do Sul">Mato Grosso do Sul</option>
                                <option value="Minas Gerais">Minas Gerais</option>
                                <option value="Pará">Pará</option>
                                <option value="Paraíba">Paraíba</option>
                                <option value="Paraná">Paraná</option>
                                <option value="Pernambuco">Pernambuco</option>
                                <option value="Piauí">Piauí</option>
                                <option value="Rio de Janeiro">Rio de Janeiro</option>
                                <option value="Rio Grande do Norte">Rio Grande do Norte</option>
                                <option value="Rio Grande do Sul">Rio Grande do Sul</option>
                                <option value="Rondônia">Rondônia</option>
                                <option value="Roraima">Roraima</option>
                                <option value="Santa Catarina">Santa Catarina</option>
                                <option value="São Paulo">São Paulo</option>
                                <option value="Sergipe">Sergipe</option>
                                <option value="Tocantins">Tocantins</option>
                            </select>`);
        if (estado == undefined) {
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Estado não Selecionado. Preencha a estado de origem corretamente!
                            </div>`);
        }
        resposta.write(`</div>
                    </div>
                    <div class="form-group">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="produtoNovo" name="produtoNovo">
                            <label class="form-check-label" for="produtoNovo">
                                Produto novo
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Enviar</button>
                    <button class="btn btn-secondary"><a href="./index.html">voltar</a></button>
                    </div>
                    </form>
                    </div>
                    </body>
                    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
                    integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
                    crossorigin="anonymous"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
                    integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
                    crossorigin="anonymous"></script>
                    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"
                    integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
                    crossorigin="anonymous"></script>
                    </html>`)
    }
    resposta.end()
}


app.post('/cadastrarProdutos', cadastrarProduto)

app.use('/listarProdutos', (req, resp) => {
    resp.write('<!DOCTYPE html>');
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<meta charset="UTF-8">');
    resp.write (`<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
    integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">`)
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<div class="container mt-5">');
    resp.write(`<h1>Lista dos produtos.</h1>`);
    resp.write('<table class="table table-bordered table-dark">');
    resp.write('<thead>');
    resp.write('<tr>');
    resp.write('<th scope="col">Nome: </th>');
    resp.write('<th scope="col">Descrição: </th>');
    resp.write('<th scope="col">Tipo: </th>');
    resp.write('<th scope="col">Origem: </th>');
    resp.write('<th scope="col">Produto novo: </th>');
    resp.write('</tr>');
    resp.write('</thead>');
    for (let i = 0; i < listaProdutos.length; i++){  
        resp.write('<tbody>');    
        resp.write('<tr>');    
        resp.write(`<td>${listaProdutos[i].nome} </td>`);
        resp.write(`<td>${listaProdutos[i].descricao} </td>`);
        resp.write(`<td>${listaProdutos[i].tipo} </td>`);
        resp.write(`<td>${listaProdutos[i].cidade} - ${listaProdutos[i].estado}</td>`);
        if (listaProdutos[i].produtoNovo)
            resp.write(`<td>Sim</td>`);
        else
            resp.write(`<td>Não</td>`);
        resp.write('</tr>');
        resp.write('</tbody>');
    }
    resp.write('</table>');
    resp.write('<br>');
    resp.write('<hr>');
    resp.write('<a href ="/"><p>Voltar!</p></a>');
    resp.write('</div>');
    resp.write('</body>');
    
    resp.write(`<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
    integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
    crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
    integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
    crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"
    integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
    crossorigin="anonymous"></script>`);
    resp.write('</html>');
    resp.end();
});