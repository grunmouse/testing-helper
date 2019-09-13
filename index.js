/**
 * Класс предназначен для упрощения выполнения однотипных подготовок перед каждым тестом
 * Тесты могут требовать разный объём подготовок при общей схеме, например - выполнение всех ранее протестированных операций.
 */


class TestingHelper{
	constructor(config){
		this.functions = config || [];
	}
	
	add(name, func){
		if(!func){
			func = name;
			name = "";
		}
		this.functions.push([name, func]);
	}
	
	/**
	 * Метод вызывает строго последовательно функции из хранящегося в нём массива
	 * Функции вызываются от начала массива до его конца или до заданного лимита (по номеру или по имени)
	 * На вход функции подаются аргументы, переданные в массиве args
	 * если какая-то из функций возвращает массив - этот массив заменит собой исходный массив аргументов
	 * @param {Array} args
	 * @param {?(number|string)} limit - количество выполняемых операций или имя последней операции
	 */
	run(args, limit){
		if(typeof args === 'string' || typeof args === 'number'){
			limit = args;
			args = [];
		}
		if(!limit){
			limit = this.functions.length;
		}
		else if(typeof limit === 'string'){
			limit = this.functions.findIndex(([name, func])=>(name===limit))+1;
		}
		else if(typeof limit === 'number'){
			limit = Math.min(this.functions.length, limit);
		}

		let state = args;
		
		for(let i=0; i<limit; ++i){
			let [name, func] = this.functions[i];
			let result = func(...state);
			if(result && Array.isArray(result)){
				state = result;
			}
		}
		return state;
	}
}

module.exports = TestingHelper;