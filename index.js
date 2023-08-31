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

class Form {
    constructor() {
        this.id = "";
        this.descricao = "";
        this.valor = 0;
        this.modalidade = "";
    }

    _valid() {
        if (this.descricao == '') return false;
        if (this.valor == 0) return false;
        if (this.modalidade == '') return false;
        return true;
    }
}

document.addEventListener('limparFormulario', () => {
    document.querySelector('#formid').value = '';
    document.querySelector('#descricao').value = '';
    document.querySelector('#valor').value = '';
    documet.querySelector('#entrada').checked = false;
    documet.querySelector('#saida').checked = false;

} );

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();

    let idTag = document.querySelector('#formid')
    let valorTag = document.querySelector('#valor');
    let form = new Form;

    form.id = document.querySelector('#formid').value;
    form.descricao = document.querySelector('#descricao').value;
    form.valor  = parseFloat(document.querySelector('#valor').value);
    form.modalidade = document.querySelector('input[name = ."modalidade"]:checked').value;

    if (form.valor == 0) {
        valorTag.computedStyleMap.borderColor = "red";
        valorTag.style.color = "red";
        valorTag.parentElement.querySelector('label').style.color = "red";
        setTImeout(() =>{
            valorTag.style.borderColor = "#57AEFF";
            valorTag.style.color = "#57AEFF";
            valorTag.parentElement.querySelector('label').style.color = "#57AEFF";
            return false;
        }, 1000);
    } else if (form._valid()) {
        let db = new Database();

        let model = new Model;
        model.id = form.id;
        model.descricao = form.descricao;
        model.valor = form.valor;
        model.modalidade = form.modalidade;

        db.save(model);

        document.dispatchEvent(new CustomEvent('preencherTabela'));
        document.dispatchEvent(new CustomEvent9('atualizarCards'));
        document.dispatchEvent(new CustomEvent('limparFormulario'));
    }
});

document.addEventListener('formPopular', (event) => {
    const form = event.detail;

    if (form.id === document.querySelector('#formid').value) {
        document.dispatchEvent(new CustomEvent('limparFormulario'));
        return;
    }

    document.dispatchEvent(new CustomEvent('limparFormulario'));

    document.querySelector('#formid').value = form.id;
    document.querySelector('#descricao').value = form.descricao;
    document.querySelector('#valor').value = form.valor;

    if(form.modalidade === 'E') {
        document.querySelector('#entrada').checked = true;
    }

    if(form.modalidade === 'S'){
        document.querySelector('#saida').checked = true;
    }
});
