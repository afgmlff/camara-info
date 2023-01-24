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

app.post('/sendId', (req, res) => {
    const id = req.body.id
    if(id) {
        axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}/ocupacoes`)
        .then(response => {
            res.json(response.data);
            console.log(response.data)
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
    } else {
        res.status(400).send("Missing id parameter");
    }
});


app.post('/geral', (req, res) => {
    const id = req.body.id
    if(id) {
        axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}`)
        .then(response => {
            res.json(response.data);
            console.log(response.data)
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
    } else {
        res.status(400).send("Missing id parameter");
    }
});


app.get('/uflist', (req, res) => {
    axios.get('https://dadosabertos.camara.leg.br/api/v2/referencias/uf')
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        console.log(error);
    });
});

app.post('/ufsearch', (req, res) => {
    const id = req.body.id
    if(id) {
        axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=${id}&ordem=ASC&ordenarPor=nome`)
        .then(response => {
            res.json(response.data);
            console.log(response.data)
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
    } else {
        res.status(400).send("Missing id parameter");
    }
});


app.listen(5000, ()=> {console.log("Servidor rodando na porta 5000...")})

