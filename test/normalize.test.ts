import test from 'ava';
import { Item } from '../example/models';
import { NormalizedData, Normalized } from '../src';

test('init values', t => {
    let data: NormalizedData<Item> = Normalized.empty();
    t.is(data.uniq, 'id');
    t.true(Array.isArray(data.order));


    const items = Normalized.toList(data);
    t.is(items.length, 0);
});

test('append', t => {
    let data: NormalizedData<Item> = Normalized.empty();
    const item = {
        id: 1,
        name: 'Test 1'
    };

    data = data.append([item]);
    const items = Normalized.toList(data);
    t.is(items.length, 1);
    t.true(items[0].id === item.id);
});

test('update', t => {
    let data: NormalizedData<Item> = Normalized.empty();
    const order = [1,2,3];
    data = data.append(
        order.map(id => {
            return {id: id, name: `Test ${id}`}
        })
    );
    const item = {
        id: 1,
        name: 'Test 1 (NEW)'
    };

    data = data.updateOne(item);
    const items = Normalized.toList(data);
    t.is(items.length, 3);
    const newItem = data.getOne(item.id);
    t.true(newItem.id === item.id);
    t.true(newItem.name === item.name);
});

test('update many', t => {
    let data: NormalizedData<Item> = Normalized.empty();
    const order = [1,2,3];
    data = data.append(
        order.map(id => {
            return {id: id, name: `Test ${id}`}
        })
    );

    data = data.update(
        order.map(id => {
            return {id: id, name: `New ${id}`}
        })
    );
    const items = Normalized.toList(data);
    t.is(items.length, 3);

    for (let i of items) {
        t.true(i.name.startsWith('New'))
    }
});


test('update will append if not exist??', t => {
    let data: NormalizedData<Item> = Normalized.empty();
    const item = {
        id: 1,
        name: 'Test 1'
    };
    
    data = data.updateOne(item);
    const items = Normalized.toList(data);
    t.is(items.length, 1);
});

test('order', t => {
    let data: NormalizedData<Item> = Normalized.empty();
    const order = [1,2,3];
    data = data.append(
        order.map(id => {
            return {id: id, name: `Test ${id}`}
        })
    );

    const items = Normalized.toList(data);

    for (let [i, id] of order.entries()) {
        t.true(items[i].id === id);
    }
});

test('order after update', t => {
    let data: NormalizedData<Item> = Normalized.empty();
    const order = [1,2,3];
    data = data.append(
        order.map(id => {
            return {id: id, name: `Test ${id}`}
        })
    );

    data = data.updateOne({
        id: 2,
        name: 'Test 2 (updated)'
    });

    const items = Normalized.toList(data);

    for (let [i, id] of order.entries()) {
        t.true(items[i].id === id);
    }
});

test('remove', t => {
    let data: NormalizedData<Item> = Normalized.empty();
    const order = [1,2,3];
    const id = 3;
    data = data.append(
        order.map(id => {
            return {id: id, name: `Test ${id}`}
        })
    );
    data = data.removeOne(id);

    const items = Normalized.toList(data);
    t.is(items.length, order.filter(i => i !== 3).length);
    t.is(items.findIndex(i => i.id === id), -1);
});

test('toString', t => {
    var source = [
        { id: 1, name: '1'},
        { id: 2, name: '2'}
    ];
    let data: NormalizedData<Item> = Normalized.toData(source)

    t.is(JSON.stringify(data), JSON.stringify(source));


    // const parsedData = Normalized.parse(string);
   
});

test('parse', t => {
    var source = JSON.stringify([
        { id: 1, name: '1'},
        { id: 2, name: '2'}
    ]);

    let data: NormalizedData<Item> = Normalized.parse(source)

    const items = Normalized.toList(data);
    t.is(items.length, 2);
    t.is(items[0].id, 1);
});