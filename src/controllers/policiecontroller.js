import fetch from 'fetch';
import config from 'config';
const fetchUrl = fetch.fetchUrl

exports.getPolicies = async() =>{
    return new Promise(function(resolver, reject) {
        fetchUrl(config.url.policies, (error, meta, body) => {
            try{
                if(error) return reject(error);
                let resJson = JSON.parse(body.toString())
                return resolver(resJson.policies);
            }
            catch(err){
                return reject(err);
            }
        })
    })
}