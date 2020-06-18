import fetch from 'fetch';
import config from 'config';
const fetchUrl = fetch.fetchUrl

exports.userDataByUserId = async(userId) => {
    try{
        let policies = await getPolicies();
        policies = policies.filter(policie => policie.clientId === userId);
        return policies;
    }
    catch(err){
        return err;
    }
}

exports.getClients = async () => {
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