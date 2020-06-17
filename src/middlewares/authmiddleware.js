import fetch from 'fetch';
import config from 'config';
const fetchUrl = fetch.fetchUrl

exports.filterById = async (req, res, next) => {
    let clientId = req.params.id;
    try {
        let clients = await getClients();
        let client = clients.filter(client => client.id === clientId);
        handleErrorsFilterById(client, clientId, res);
        req.client = client[0];
        return next();
    }
    catch(err){
        return res.send(err.message);
    }
};

exports.filterByName = async (req, res, next) => {
    let name = req.query.name;
    try {
        let clients = await getClients();
        let client = clients.filter(client => client.name === name);
        handleErrorsFilterByName(client, name, res);
        req.client = client[0];
        return next();
    }
    catch(err){
        return res.send(err.message);
    }
}

exports.filterPoliceByName = async (req, res, next) => {
    let name = req.params.username;
    try {
        let clients = await getClients();
        let client = clients.filter(client => client.name === name);
        handleErrorsFilterPoliceByName(client, name, res);
        req.client = client[0];
        return next();
    }
    catch(err){
        return res.send(err.message);
    }
}

const getClients = async () => {
    return new Promise(function(resolver, reject) {
        fetchUrl(config.url.clients, (error, meta, body) => {
            try{
                if(error) return reject(error);
                let resJson = JSON.parse(body.toString())
                return resolver(resJson.clients);
            }
            catch(err){
                return reject(err);
            }
        })
    })
}

const handleErrorsFilterByName = (client, name, res) => {
    handleErrorClientFilterByName(client, name, res);
    if(client[0].role !== 'user' && client[0].role !== 'admin'){ 
        res.status(403);
        throw Error(`No permisions for user with name ${name}`);
    }
}

const handleErrorsFilterById = (client, clientId, res) => {
    if(client.length === 0){
        res.status(404);
        throw Error(`Client with id ${clientId} not found`);
    }
    if(client.length > 1) throw Error(`There are more than 1 client for this id ${clientId}`);
    if(client[0].role !== 'user' && client[0].role !== 'admin'){ 
        res.status(403);
        throw Error(`No permisions for user with id ${clientId}`);
    }
}

const handleErrorsFilterPoliceByName = (client, name, res) => {
    handleErrorClientFilterByName(client, name, res);
    if(client[0].role !== 'admin'){ 
        res.status(403);
        throw Error(`No permisions for user with name ${name}`);
    }
}

const handleErrorClientFilterByName = (client, name, res) => {
    if(client.length === 0){
        res.status(404);
        throw Error(`Client with name ${name} not found`);
    }
    if(client.length > 1) throw Error(`There are more than 1 client for this name ${name}`);
}