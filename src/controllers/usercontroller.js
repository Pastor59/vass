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