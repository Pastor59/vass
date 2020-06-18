import fetch from 'fetch';
import config from 'config';
const fetchUrl = fetch.fetchUrl

const userDataByUserId = async(userId) => {
    try{
        let policies = await getPolicies();
        let userPolicies = policies.filter(policy => policy.clientId === userId);
        return userPolicies;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

const getPolicies = async() =>{
    return new Promise(function(resolver, reject) {
        fetchUrl(config.url.policies, (error, meta, body) => {
            try{
                if(error) return reject(error);
                let resJson = JSON.parse(body.toString());
                return resolver(resJson.policies);
            }
            catch(err){
                return reject(err);
            }
        })
    })
}

module.exports = {userDataByUserId, getPolicies};