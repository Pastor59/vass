import fetch from 'fetch';
import config from 'config';
const fetchUrl = fetch.fetchUrl

exports.filterById = async (req, res, next) => {
    let clientId = req.params.id;
    try {
        let clients = await getClients();
        let client = clients.filter(client => client.id === clientId);
        if(client.length === 0) throw Error(`No client with id ${clientId}`);
        if(client.length > 1) throw Error(`There are more than 1 client for id ${clientId}`);
        if(client[0].role !== 'user' && client[0].role !== 'admin') throw Error(`No permisions for user with id ${clientId}`);
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