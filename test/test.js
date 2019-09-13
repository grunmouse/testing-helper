const assert = require('assert');
const TestingHelper = require('../index.js');

describe('TestingHelper', ()=>{
	describe('create', ()=>{
		it('without config', ()=>{
			const helper = new TestingHelper();
			assert.ok(helper);
			assert.ok(helper.functions instanceof Array);
		});
		it('with config', ()=>{
			const helper = new TestingHelper([
				['a', (...a)=>(a)],
				['b', (...a)=>(a)],
			]);
			assert.ok(helper);
			assert.ok(helper.functions instanceof Array);
			assert.equal(helper.functions.length, 2);
		});
	});
	describe('add', ()=>{
		it('with name', ()=>{
			const helper = new TestingHelper();
			assert.equal(helper.functions.length, 0);
			helper.add('name', (a)=>(a+1));
			assert.equal(helper.functions[0][0], 'name');
			assert.equal(helper.functions[0][1](2), 3);
		});
		it('without name', ()=>{
			const helper = new TestingHelper();
			assert.equal(helper.functions.length, 0);
			helper.add((a)=>(a+1));
			assert.equal(helper.functions[0][0], '');
			assert.equal(helper.functions[0][1](2), 3);
		});
	});
	describe('run', ()=>{
		it('run all', ()=>{
			const helper = new TestingHelper([
				['a', (obj)=>{obj.a = true}],
				['b', (obj)=>{obj.b = true}],
				['c', (obj)=>{obj.c = true}]
			]);
			const obj = {};
			helper.run([obj]);
			assert.ok(obj.a);
			assert.ok(obj.b);
			assert.ok(obj.c);
		});		
		it('run limit name', ()=>{
			const helper = new TestingHelper([
				['a', (obj)=>{obj.a = true}],
				['b', (obj)=>{obj.b = true}],
				['c', (obj)=>{obj.c = true}]
			]);
			const obj = {};
			helper.run([obj], 'b');
			assert.ok(obj.a);
			assert.ok(obj.b);
			assert.ok(!obj.c);
		});		
		it('run limit count', ()=>{
			const helper = new TestingHelper([
				['a', (obj)=>{obj.a = true}],
				['b', (obj)=>{obj.b = true}],
				['c', (obj)=>{obj.c = true}]
			]);
			const obj = {};
			helper.run([obj], 2);
			assert.ok(obj.a);
			assert.ok(obj.b);
			assert.ok(!obj.c);
		});
		it('run replace args', ()=>{
			const helper = new TestingHelper([
				['a', (obj)=>{obj.a = true}],
				['b', (obj)=>{(obj.b = true); return [{d:true}];}],
				['c', (obj)=>{obj.c = true;}]
			]);
			const obj = {};
			let o2 = helper.run([obj])[0];
			assert.ok(obj.a);
			assert.ok(obj.b);
			assert.ok(!obj.c);
			assert.notEqual(obj, o2);
			assert.ok(o2.d);
			assert.ok(o2.c);
		});
	});
});