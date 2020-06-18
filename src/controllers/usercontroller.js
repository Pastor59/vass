import fetch from 'fetch';
import config from 'config';
const fetchUrl = fetch.fetchUrl

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