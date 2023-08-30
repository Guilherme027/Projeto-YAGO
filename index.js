window.onload = function() {
    document.dispatchEvent(new CustomEvent('preencherTabela'));
    document.dispatchEvent(new CustomEvent('atualizarCards'));
    document.dispatchEvent(new CustomEvent('limparFormulario'));
}

// Código para a alteração dos cards

document.addEventListener('atualizarCards', () => {
    let proventos = 0;
    let gastos = 0;
    let saldo = 0;
    
    db.getList().forEach(el => {
        if (el.modalidade == 'E'){
            proventos += el.valor;
        }

        if (el.modalidade == 'S') {
            gastos += el.valor;
        }

        saldo = proventos - gastos;
    });
    document.querySelector('#card-entrada').innerHTML = toMoney(proventos);
    document.querySelector('#card-saida').innerHTML = toMoney(gastos * -1);
    document.querySelector('card-saldo').innerHTML = toMoney(saldo);
});

// Retornos para bd

class Model {
    constructor() {
        this.id = "";
        this.descricao = "";
        this.valor = 0;
        this.lancamento = geTDatePTBR();
        this.modalidade = "";
    }
}

class Database {
    constructor() {
        this.list = this_updateList();
    }

    _updateList() {
        const storage = JSON.parse(localStorage.getItem('list'));
        return (Array.isArray(storage) && storage.length > 0) ? storage : [];
    }

    getList() {
        return this.list;
    }

    get(id) {
        return this.list.filter(el => el.id === id)[0];
    }

    save(model) {
        if (model.id === '') {
            model.id = uuidv4();
            this.list.push(model);
        } else {
            let newList = [];
            
            this.list.forEach(el => {
                newList.push((el.id == model.id) ? model : el);
            });
            this.list = newList; 
        }

        localStorage.setItem('list', JSON,stringify(this.list));
    }

    delete(id) {
        this.list = this.list.filter(el => el.id !== id);
        localStorage.setItem('list', JSON.stringify(this.list));
    }
}

// Código para colocar o forms para ser interativo 

lass Form {
    constructor() {
        this.id = "";
        this.descricao = "";
        this.valor = 0;
        this.modalidade = "";
    }

    __valid() {
        if (this.descricao == '') return false;
        if (this.valor == 0) return false;
        if (this.modalidade == '') return false;
        return true;
    }
}

document.addEventListener('limparFormulario', () => {
    
} )