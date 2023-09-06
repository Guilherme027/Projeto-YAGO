

//definindo as const do cards

const entrada = document.querySelector("#card-entrada");
const saida = document.querySelector("#card-saida");
const saldo = document.querySelector("#card-saldo");


// definindo as conts do botão e da tabela
const btnSave = document.querySelector("#button");
const tbody = document.querySelector("tbody");

let items = [];


function loadItens() {
    items = getItensBD();
    tbody.innerHTML = "";
    items.forEach((item, index) => {
        insertItem(item, index);
    });

    getTotal();

};

// clique do botão onde será salvo os dados
btnSave.onclick = (e) => {

    e.preventDefault()

    let formid = document.getElementById('formid');

    const descricao = document.querySelector("#descricao");
    const valor = document.querySelector("#valor");
    const tipo = document.querySelector('input[name="modalidade"]:checked');

    if (descricao.value === "" || valor.value === "" || tipo.value === "") {
        return alert("Preencha todos os campos");
    }

    if (formid.value !== '') {
        items[formid.value].descricao = descricao.value;
        items[formid.value].valor = valor.value;
        items[formid.value].tipo = tipo.value;
    } else {
        items.unshift({ 'descricao': descricao.value, 'valor': valor.value, 'tipo': tipo.value })
    }

    formLimpo();
    setItensBD();
    loadItens();

};




// Função para deletar os itens

function deleteItem(index) {


    let userConfirmation = confirm("Você tem certeza de que deseja deletar este item?");

    // Se foi conformidado a exclusão
    if (userConfirmation) {
        // Delete o item
        items.splice(index, 1);
        setItensBD();
        loadItens();
        console.log(`Item ${index} apagado.`);

    } else {

        console.log('Operação de exclusão cancelada.');

    }
};

// Função para editar os forms




// Função para editar os valores inseridos

function editarItem(edit = true, index = 0) {

    let formid = document.getElementById('formid');

    if (formid.value === index.toString()) {
        formLimpo();
        return;
    }

    if (edit) {

        formid.value = index.toString();

        const descricao = document.querySelector("#descricao");
        const valor = document.querySelector("#valor");

        if (items[index].tipo === 'entrada') {
            document.querySelector('#entrada').checked = true
        } else {
            document.querySelector('#saida').checked = true
        }

        descricao.value = items[index].descricao
        valor.value = items[index].valor
        id = index

        document.getElementById('button').innerHTML = `Editar <ion-icon name="create-outline" id="salvar"></ion-icon>
        `


    };

}

function formLimpo(index) {

    let formid = document.getElementById('formid')
    let descricao = document.querySelector('#descricao')
    let valor = document.querySelector('#valor')

    descricao.value = ''
    valor.value = ''
    formid.value = ''
    document.querySelector('#entrada').checked = false
    document.querySelector('#saida').checked = false
    document.getElementById('button').innerHTML = `Salvar <ion-icon name="add-circle-outline"
 id="salvar"></ion-icon>`
}

// Função para colocar os valores para a moeda brasileira

function formatMoney(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}



//Função para inserir os dados do forms e armazenar na tabela

function insertItem(item, index) {

    const descricao = document.querySelector("#descricao");
    const valor = document.querySelector("#valor");
    const tipo = document.querySelector('input[name="modalidade"]:checked');

    let tr = document.createElement("tr");

    tr.innerHTML = (`
<td>${item.descricao}</td>
<td> ${formatMoney(Number(item.valor))}</td>
<td>${formatData()}</td>
<td>${item.tipo === "entrada"
            ? '<p>Entrada<p/>'
            : '<p>Saída</p>'}
            </td>
<td>
<button  onclick="editarItem(true, ${index})" id="create"><ion-icon name="create-outline" class="group-icons-create"></ion-icon>
    <button  onclick="deleteItem(${index})" id="trash"><ion-icon name="trash-outline" class="group-icons-trash"></ion-icon></button>
</td>`);

    tbody.appendChild(tr)

};


// função para os valores inseridos no cards
function getTotal() {
    const totalE = items.filter((item) => item.tipo === "entrada").map((transaction) => Number(transaction.valor));
    const totalS = items.filter((item) => item.tipo === "saida").map((transaction) => Number(transaction.valor));
    const totalTe = totalE.reduce((acc, cur) => acc + cur, 0).toFixed(2);
    const totalTs = Math.abs(totalS.reduce((acc, cur) => acc + cur, 0)).toFixed(2);

    const totalItems = (totalTe - totalTs).toFixed(2);

    let alerta = document.querySelector('#alerta');

    if (totalItems < 0) {
        let imagem1 = document.getElementById("imagem1")
        let imagem2 = document.getElementById('imagem2')
        imagem1.style.display = "none"
        imagem2.style.display = "block"
        document.getElementById('card-saldo').style.color = "red";
    } else {
        document.getElementById('card-saldo').style.color = "black";
        imagem1.style.display = "block"
        imagem2.style.display = "none"
    }


    document.getElementById("card-entrada").textContent = formatMoney(Number(totalTe));
    document.getElementById("card-saida").textContent = formatMoney(Number(totalTs));
    document.getElementById("card-saldo").textContent = formatMoney(Number(totalItems));

};

// salvando Localstorage

const getItensBD = () => JSON.parse(localStorage.getItem("bd_items")) ?? [];
const setItensBD = () => localStorage.setItem("bd_items", JSON.stringify(items));

function zerofill(numero, lagura) {
    return String(numero).padStart(lagura, '0');
}


// Função para colocar a data do formato BR

function formatData() {

    const data = new Date();
    const dia = zerofill(data.getDate(), 2);
    const mes = zerofill(data.getMonth() + 1, 2);
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`
}

// Novamente está recarregando a PÁG
loadItens();