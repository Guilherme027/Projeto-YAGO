const tbody = document.querySelector("tbody");
const descricao = document.querySelector("#descricao");
const valor = document.querySelector("#radio");
const btn = document.querySelector("#button");

const entrada = document.querySelector("#card-entrada");
const saida = document.querySelector("#card-saida");
const saldo = document.querySelector("#card-saldo");

let = items;


btn.onclick = () => {
    if (descricao.value === "")
}


function deletaItem(index) {
    item.splice(index, 1);
    setItensBD();
    load
}
function inserirItem(item, index) {
    let tr = document.createElement("tr");

    tr.innerHTML = `
    <td>${item.descricao}</td>
    <td>R$ ${item.valor}</td>
    <td>${formtdata()}</td>
    <td>${item.radio === "entrada"
    ? '<p>Entrada</p>'
    : '<p>Saída</p>'
}</td>
<td>
    <button onclick="deletarItem(${index})"<ion-icon name="create" class="group-ions-create"></ion-icon></button>
    <button onclick="editarItem(${index})"<ion-icon name="trash" class="group-icons-trash"></ion-icon></button>
    </td>`;
}   
function loadItens() {
    items = getItensBD();
    tbody.innerHTMl = "";
    items.forEach((item, index) => {
        inserirtItem(item, index);
    });
}

const getItensBD = () => JSON.parse(localStorage.getItem('db_itens')) ?? [];
const setItensBD = () =>
    localStorage.setItem("db_itens", JSON.stringify(items));

loadItens();