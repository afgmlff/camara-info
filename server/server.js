const express = require('express')
const axios = require('axios');
const app = express()

app.use(express.json());

app.get('/data', (req, res) => {
    axios.get('https://dadosabertos.camara.leg.br/api/v2/deputados')
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        console.log(error);
    });
});

app.post('/data/post', (req, res) => {
    const id = req.body.id
    axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}/ocupacoes`)
    .then(response => {
        res.json(response.data)
        console.log(id)
    })
    .catch(error => {
        console.log(error)
    });
});

app.listen(5000, ()=> {console.log("Servidor rodando na porta 5000...")})