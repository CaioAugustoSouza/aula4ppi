import express from 'express';
import path from 'path'
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;

const app = express();

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})

app.use(express.static(path.join(process.cwd(), 'publico')));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    secret: 'sercetKey',
    resave: true, 
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000*60*60*24
    }
}));


function usuarioEstaAutenticado(requisicao, resposta, next){
    if (requisicao.session.usuarioAutenticado){
        next();
    }
    else{
        resposta.redirect('/login.html');
    }
}

function autenticarUsuario(requisicao, resposta){
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == 'caio' && senha == '102030'){
        requisicao.session.usuarioAutenticado = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(),{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/');
    }
    else{
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
                        <div class="container">
                            <div class="alert alert-danger" role="alert">
                              Usuário e/ou senha iválido!
                            </div>
                            <a class="btn btn-primary" href="/login.html" role="button">Voltar</a>`)
        
        if (requisicao.cookies.dataUltimoAcesso){
            resposta.write (`<hr><p>Ultimo acesso realizado em ${requisicao.cookies.dataUltimoAcesso}</p>`)
        }
        resposta.write(`
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
        resposta.end();
    }
}

app.post('/login', autenticarUsuario);

app.get('/login', (requisicao,resposta)=>{
    resposta.redirect('/login.html');
});

app.get('/logout', (requisicao, resposta) => {
    requisicao.session.destroy();
    //req.session.usuarioLogado = false;
    resposta.redirect('/login.html');
});

app.use(usuarioEstaAutenticado,express.static(path.join(process.cwd(), 'protegido')));

let listaEmpresas = [];

function cadastrarEmpresas(requisicao, resposta) {
    const cnpj = requisicao.body.cnpj;
    const nome = requisicao.body.nome;
    const razao = requisicao.body.razao;
    const endereco = requisicao.body.endereco;
    const cidade = requisicao.body.cidade;
    const estado = requisicao.body.estado;
    const cep = requisicao.body.cep;
    const email = requisicao.body.email;
    const telefone = requisicao.body.telefone;

    if (cnpj && nome && razao && endereco && cidade && estado && cep && email && telefone) {
        listaEmpresas.push({
            cnpj: cnpj,
            nome: nome,
            razao: razao,
            endereco: endereco,
            cidade: cidade,
            estado: estado,
            cep: cep,
            email: email,
            telefone: telefone
        })
        resposta.redirect('/listarEmpresas')
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
                                <legend>Cadastro de Empresas</legend>

                                <form method="POST" action='/cadastrarEmpresa' class="border">
                                    <div class="ml-5 mr-5 mb-5 mt-5">
                                        <div class="form-group">
                                            <label for="cnpj">CNPJ</label>
                                            <input type="text" class="form-control" id="cnpj" name="cnpj"
                                                placeholder='exemplo: "25.130.140/0001-55"' value="${cnpj}">`)
        if (cnpj==''){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            CNPJ não informado.
                        </div>
            `);
        }
        resposta.write(`        
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="nome">Nome Fantasia</label>
                                                <input name="nome" type="text" class="form-control" id="nome"
                                                    placeholder='exemplo: "Loja do 1,99"' value="${nome}">`)
        if (nome==''){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                           Nome fantasia não informado.
                        </div>
            `);
        }
        resposta.write(`
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="razao">Razão Social</label>
                                                <input type="text" class="form-control" id="razao" name="razao"
                                                    placeholder='exemplo: "Moraes & irmãos Ltda"' value="${razao}">`)
        if (razao==''){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                        Razão Social não informada.
                        </div>
            `);
        }
        resposta.write(`                                           
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="endereco">Endereço</label>
                                            <input type="text" class="form-control" id="endereco" name="endereco"
                                                placeholder='exemplo: "Rua Antônio Carlos"' value="${endereco}">`)
        if (endereco==''){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                        Endereço não informada.
                        </div>
            `);
        }
        resposta.write(`
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="cidade">Cidade</label>
                                                <input type="text" class="form-control" name="cidade" id="cidade" placeholder='exemplo: "Presidente Prudente"' value="${cidade}">`)
        if (cidade==''){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                        Cidade não informada.
                        </div>
            `);
        }
        resposta.write(`                                
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="estado">Estado</label>
                                                <select id="estado" name="estado" class="form-control">
                                                    <option value="${estado}" selected>${estado}</option>
                                                    <option value="AC">AC</option>
                                                    <option value="AL">AL</option>
                                                    <option value="AP">AP</option>
                                                    <option value="AM">AM</option>
                                                    <option value="BA">BA</option>
                                                    <option value="CE">CE</option>
                                                    <option value="DF">DF</option>
                                                    <option value="ES">ES</option>
                                                    <option value="GO">GO</option>
                                                    <option value="MA">MA</option>
                                                    <option value="MT">MT</option>
                                                    <option value="MS">MS</option>
                                                    <option value="MG">MG</option>
                                                    <option value="PA">PA</option>
                                                    <option value="PB">PB</option>
                                                    <option value="PR">PR</option>
                                                    <option value="PE">PE</option>
                                                    <option value="PI">PI</option>
                                                    <option value="RJ">RJ</option>
                                                    <option value="RN">RN</option>
                                                    <option value="RS">RS</option>
                                                    <option value="RO">RO</option>
                                                    <option value="RR">RR</option>
                                                    <option value="SC">SC</option>
                                                    <option value="SP">SP</option>
                                                    <option value="SE">SE</option>
                                                    <option value="TO">TO</option>
                                                </select>`)                                                
        if (!estado){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                        Estado não informado. ${estado}
                        </div>
            `);
        }
        resposta.write(`                  </div>  
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="cep">CEP</label>
                                                <input name="cep" type="text" class="form-control" id="cep"
                                                    placeholder='exemplo: "19050-040"' value="${cep}">`)
        if (cep==""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                        CEP não informado. ${cep}
                        </div>
            `);
        }
        resposta.write(` 
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="email">E-mail</label>
                                                <input type="text" class="form-control" id="email" name="email"
                                                    placeholder='exemplo: "caio@hotmail.com"' value="${email}">`)
        if (email==""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                        CEP não informado. ${email}
                        </div>
            `);
        }
        resposta.write(` 
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-gro col-md-6">
                                                <label for="telefone">Telefone</label>
                                                <input type="phone" class="form-control" id="telefone" name="telefone"
                                                    placeholder='exemplo: "(84)988995-9988"' value="${telefone}">`)
        if (telefone==""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                        CEP não informado. ${telefone}
                        </div>
            `);
        }
        resposta.write(` 
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-primary mt-5">Enviar</button>
                                        <button class="btn btn-secondary mt-5"><a href="./index.html">voltar</a></button>

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


app.post('/cadastrarEmpresa', usuarioEstaAutenticado ,cadastrarEmpresas)

app.use('/listarEmpresas', usuarioEstaAutenticado, (requisicao, resposta) => {
    resposta.write('<!DOCTYPE html>');
    resposta.write('<html>');
    resposta.write('<head>');
    resposta.write('<meta charset="UTF-8">');
    resposta.write(`<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
    integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">`)
    resposta.write('</head>');
    resposta.write('<body>');
    resposta.write('<div class="container mt-5">');
    resposta.write(`<h1>Lista de Empresas.</h1>`);
    resposta.write('<table class="table table-bordered table-dark">');
    resposta.write('<thead>');
    resposta.write('<tr>');
    resposta.write('<th scope="col">Nome Fantasia: </th>');
    resposta.write('<th scope="col">Razão Social: </th>');
    resposta.write('<th scope="col">CNPJ: </th>');
    resposta.write('<th scope="col">Localização: </th>');
    resposta.write('<th scope="col">Email: </th>');
    resposta.write('<th scope="col">Telefone: </th>');
    resposta.write('</tr>');
    resposta.write('</thead>');
    for (let i = 0; i < listaEmpresas.length; i++) {
        resposta.write('<tbody>');
        resposta.write('<tr>');
        resposta.write(`<td>${listaEmpresas[i].nome} </td>`);
        resposta.write(`<td>${listaEmpresas[i].razao} </td>`);
        resposta.write(`<td>${listaEmpresas[i].cnpj} </td>`);
        resposta.write(`<td>${listaEmpresas[i].cidade} - ${listaEmpresas[i].estado}</td>`);
        resposta.write(`<td>${listaEmpresas[i].email}</td>`);
        resposta.write(`<td>${listaEmpresas[i].telefone}</td>`);
        resposta.write('</tr>');
        resposta.write('</tbody>');
    }
    resposta.write('</table>');
    resposta.write('<br>');
    resposta.write('<hr>');
    if (requisicao.cookies.dataUltimoAcesso){
        resposta.write (`<p>Ultimo acesso realizado em ${requisicao.cookies.dataUltimoAcesso}</p>`)
    }
    resposta.write('<a href ="/"><p>Voltar!</p></a>');
    resposta.write('</div>');
    resposta.write('</body>');

    resposta.write(`<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
    integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
    crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
    integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
    crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"
    integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
    crossorigin="anonymous"></script>`);
    resposta.write('</html>');
    resposta.end();
});