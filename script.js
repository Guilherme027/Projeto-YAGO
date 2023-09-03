

//definindo as const do cards

const entrada = document.querySelector("#card-entrada");
const saida = document.querySelector("#card-saida");
const saldo = document.querySelector("#card-saldo");


// definindo as conts do botão e da tabela
const btn = document.querySelector("#button");
const tbody = document.querySelector("tbody");

let items = [];
let id

// clique do botão onde será salvo os dados
btn.onclick = () => {
    const descricao = document.querySelector("#descricao");
    const valor = document.querySelector("#valor");
    const tipo = document.querySelector('input[name="modalidade"]:checked');

    if (descricao.value === "" || valor.value === "" || tipo.value === "") { 
        return alert("Preencha todos os campos");
    }

    if(id !== undefined) {
        items[id].descricao = descricao.value;
        items[id].valor = valor.value;
        items[id].tipo = tipo.value;
    } else {
        items.unshift({'descricao': descricao.value, 'valor': valor.value, 'tipo': tipo.value})
    }

    setItensBD();
    loadItens();

descricao.value = "";
valor.value = "";
};




// Função para deletar os itens

function deleteItem(index) {


let userConfirmation = confirm("Você tem certeza de que deseja deletar este item?");

// Se o usuário confirmou a exclusão
if (userConfirmation) {
    // Delete o item
    items.splice(index, 1);
    setItensBD();
    loadItens();
    console.log(`Item ${index} apagado.`);

}else {

    console.log('Operação de exclusão cancelada.');

}
};

// Função para editar os forms

function editarItem(index) {

openModal(true, index)
};


function openModal(edit = false, index = 0) {
const contentdesc = document.querySelectorAll('single-input')
const descricao = document.querySelector("#descricao");
const valor = document.querySelector("#valor");
const tipo = document.querySelector('input[name="modalidade"]:checked');



contentdesc.onclick = e => {
    if (e.target.className.indexOf('single-input') !== -1) {
        contentdesc.classList.remove('active')
    }
}

if (edit) {
    descricao.value = items[index].descricao
    valor.value = items[index].valor
    tipo.value = items[index].tipo
    id = index
} else {
    descricao.value = ''
    valor.value = ''
    tipo.value = ''
}

};





//Função para inserir os dados do forms
function insertItem(item, index) {

const descricao = document.querySelector("#descricao");
const valor = document.querySelector("#valor");
const tipo = document.querySelector('input[name="modalidade"]:checked');

let tr = document.createElement("tr");

tr.innerHTML = (`
<td>${item.descricao}</td>
<td> ${formatmoney(Number(item.valor))}</td>
<td>${formtdata()}</td>
<td class= "icon-up-down">${item.modalidade === "E"
            ? '<ion-icon id="icon-up" name="caret-up"></ion-icon>'
            : '<ion-icon id="icon-down" name="caret-down"></ion-icon>'}
            </td>
<td>
<button  onclick="editarItem(${index})"><ion-icon name="create-outline"></ion-icon>
    <button  onclick="deleteItem(${index})"><ion-icon name="trash-outline"></ion-icon></button>
</td>`);

tbody.appendChild(tr)

};

function loadItens() {
items = getItensBD();
tbody.innerHTML = "";
items.forEach((item, index) => {
      insertItem(item, index);
});

getTotal();

};
// função para os valores inseridos no cards
function getTotal() {
const totalE = items.filter((item) => item.tipo === "entrada").map((transaction) => Number(transaction.valor));
const totalS = items.filter((item) => item.tipo === "saida").map((transaction) => Number(transaction.valor));
const totalTe = totalE.reduce((acc, cur) => acc + cur, 0).toFixed(2);
const totalTs = Math.abs(totalS.reduce((acc, cur) => acc + cur, 0)).toFixed(2);

const totalItems = (totalTe - totalTs).toFixed(2);

let checkdalert = document.querySelector('#alerta');
if (totalItems < 0) {

    checkdalert.innerHTML = `<img src="icons/alerta.png" alt="" class="group-icons" id="alerta">`;

} else {

    checkdalert.innerHTML = `<img src="icons/saldos.png" alt="" class="group-icons">`;
}

if (totalItems < 0) {
    document.getElementById('card-saldo').style.color = "red";


} else {
    document.getElementById('card-saldo').style.color = "black";

}

entrada.innerHTML = formatmoney(Number(totalTe));
saida.innerHTML = formatmoney(Number(totalTs));
saldo.innerHTML = formatmoney(Number(totalItems));

};

// salvando Localstorage

const getItensBD = () => JSON.parse(localStorage.getItem("bd_items")) ?? [];
const setItensBD = () => localStorage.setItem("bd_items", JSON.stringify(items));

function zerofill(numero, lagura) {
return String(numero).padStart(lagura, '0');
}

function formatdata() {

const data = new Date();
const dia = zerofill(data.getDate(), 2);
const meses = zerofill(data.getMonth() + 1, 2);
const ano = data.getFullYear();

return `${dia}/${meses}/${ano}`
}

loadItens();