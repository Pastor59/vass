import PolicyController from '../controllers/policycontroller'
import UserController from '../controllers/usercontroller'

exports.filterById = async (req, res, next) => {
    let clientId = req.params.id;
    try {
        let clients = await UserController.getClients();
        let client = clients.filter(client => client.id === clientId);

        if(client.length === 0){
            res.status(404);
            throw new Error(`User with id ${clientId} doesn't exists`);
        }

        if(!isClientAdminOrUser(client[0])){
            res.status(403);
            throw new Error(`User with id ${clientId} has no permission`);
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
        let clients = await UserController.getClients();
        let client = clients.filter(client => client.name === name);
        if(client.length === 0){
            res.status(404);
            throw new Error(`User with name ${name} doesn't exists`);
        }

        if(!isClientAdminOrUser(client[0])){
            res.status(403);
            throw new Error(`User with name ${name} has no permission`);
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
        let clients = await UserController.getClients();
        let client = clients.filter(client => client.name === name);
        if(client.length === 0){
            res.status(404);
            throw new Error(`Client with name ${name} not found`);
        }

        if(!isClientAdmin(client[0])){
            res.status(403);
            throw new Error(`User with name ${name} has no permission`);
        }

        req.client = client[0];
        return next();
    }
    catch(err){
        return res.send(err.message);
    }
}

exports.filterByPoliceId = async (req, res, next) => {
    let policyId = req.params.id;
    try {
        let policies = await PolicyController.getPolicies();
        let policy = policies.filter(policy => policy.id === policyId);

        if(policy.length === 0){
            res.status(404);
            throw new Error(`Policy with id ${policyId} not found`);
        }

        let clients = await UserController.getClients();
        let client = clients.filter(client => client.id === policy[0].clientId);

        if(!isClientAdmin(client[0])){
            res.status(403);
            throw new Error(`User with id ${client[0].id} has no permission`);
        }

        req.client = client[0];
        return next();
    }
    catch(err){
        return res.send(err.message);
    }
}

const isClientAdmin = (client) => {
    return client.role === "admin";
}

const isClientAdminOrUser = (client) => {
    return client.role === "admin" || client.role === "user";
}