import fetch from 'fetch';
import config from 'config';
import PolicieController from '../controllers/policiecontroller'
const fetchUrl = fetch.fetchUrl

exports.filterById = async (req, res, next) => {
    let clientId = req.params.id;
    try {
        let clients = await getClients();
        let client = clients.filter(client => client.id === clientId);

        if(client.length === 0){
            res.status(404);
            throw new Error(`User with id ${id} doesn't exists`);
        }

        if(!isClientAdminOrUser(client[0])){
            res.status(403);
            throw Error(`No permisions for user with id ${id}`);
        };

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

        if(client.length === 0){
            res.status(404);
            throw new Error(`User with name ${name} doesn't exists`);
        }

        if(!isClientAdminOrUser(client[0])){
            res.status(403);
            throw Error(`No permisions for user with name ${name}`);
        };

        req.client = client[0];
        return next();
    }
    catch(err){
        return res.send(err.message);
    }
}

exports.filterPoliceByName = async (req, res, next) => {
    let name = req.params.name;
    try {
        let clients = await getClients();
        let client = clients.filter(client => client.name === name);

        if(client.length === 0){
            res.status(404);
            throw Error(`Client with name ${name} not found`);
        }

        if(!isClientAdmin(client[0])){
            res.status(403);
            throw Error(`No permisions for user with name ${name}`);
        }

        req.client = client[0];
        return next();
    }
    catch(err){
        return res.send(err);
    }
}

exports.filterByPoliceId = async (req, res, next) => {
    let policieId = req.params.id;
    try {
        let policies = await PolicieController.getPolicies();
        let policie = policies.filter(policie => policie.id === policieId);

        if(policie.length === 0){
            res.status(404);
            throw new Error(`Police with id ${id} doesn't exists`);
        }

        let clients = await getClients();
        let client = clients.filter(client => client.id === policie[0].clientId);

        if(client.length === 0){
            res.status(404);
            throw Error(`Client with id ${policie[0].clientId} not found`);
        }

        if(!isClientAdmin(client[0])){
            res.status(403);
            throw Error(`No permisions for user with id ${client[0].id}`);
        }

        req.client = client[0];
        return next();
    }
    catch(err){
        throw new Error(err);
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

const isClientAdmin = (client) => {
    return client.role === "admin";
}

const isClientAdminOrUser = (client) => {
    return client.role === "admin" || client.role === "user";
}