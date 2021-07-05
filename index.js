'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*']           
            }
        }
    });

    const knex = require('knex')({
        client: 'pg',
        connection: 'postgres://postgres:asdf1234@localhost:5432/todo'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return '<a href="/todo"> To Todo List </a>';
        }
    });

    server.route({
        method: 'GET',
        path: '/todo',
        handler: (request, h) => {
            return knex('todo').orderBy('id','asc');
        }
    });

    server.route({
    method: 'GET',
    path: '/todo/{id}',
    handler: function (request, h) {
        const id = request.params.id;
        return knex('todo').where('id', id);
        }
    });

    server.route({
    method: 'POST',
    path: '/todo',
    handler: function (request, h) {
        const id = request.payload.id;
        const name = request.payload.name;
        const date = request.payload.date;
        return knex('todo').insert({id: id, name: name, date: date});
        }
    });

    server.route({
    method: 'PUT',
    path: '/todo/{id}',
    handler: function (request, h) {
        const id = request.params.id;
        const name = request.payload.name;
        const date = request.payload.date;
        return knex('todo').where({ id: id }).update({ name: name, date: date}, ['id', 'name', 'date'])
        }
    });

    server.route({
    method: 'DELETE',
    path: '/todo/{id}',
    handler: function (request, h) {
        const id = request.params.id;
        return knex('todo').where('id', id).del(),reply('success')
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
    };

    process.on('unhandledRejection', (err) => {

        console.log(err);
        process.exit(1);
    });

init();
