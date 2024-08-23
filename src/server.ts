import fastify from 'fastify';

const app = fastify();

app.get('/teste', () => {
    return "hello"
})


app.listen({port: 3333}).then(()=> {
    console.log('SERVER RUNNING!!')
})