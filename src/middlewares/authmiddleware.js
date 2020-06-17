import fetch from 'fetch';
import config from 'config';
const fetchUrl = fetch.fetchUrl

exports.filterById = async (req, res, next) => {
    let clientId = req.params.id;
    try {
        let clients = await getClients();
        let client = clients.filter(client => client.id === clientId);
        handleClientErrors(client, clientId, res);
        handleErrorsFilterById(client, clientId, res);
        req.client = client[0];
        return next();
    }
    catch(err){
        return res.send(err.message);
    }
};

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

const handleClientErrors = (client, clientId, res) => {
    if(client.length === 0){
        res.status(404);
        throw Error(`Client with id ${clientId} not found`);
    }
    if(client.length > 1) throw Error(`There are more than 1 client for this id ${clientId}`);
}

const handleErrorsFilterById = (client, clientId, res) => {
    if(client[0].role !== 'user' && client[0].role !== 'admin'){ 
        res.status(403);
        throw Error(`No permisions for user with id ${clientId}`);
    }
}