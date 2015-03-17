
var Pessoa = function () {

	this.nome = '';

	Pessoa.prototype.getName = function() {
		return this.nome;
	};

};


module.exports = Pessoa;