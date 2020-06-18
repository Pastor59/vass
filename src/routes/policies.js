import express from 'express';
import {filterPoliceByName} from '../middlewares/authmiddleware';
import UserController from '../controllers/usercontroller'

const router = express.Router();

router.get('/user/:name', filterPoliceByName, (req, res, next) => {
    UserController.userDataByUserId(req.client.id)
    .then(policies =>{
        res.send(policies);
    })
    .catch(err => {
        res.status(500);
        res.send("Internal error server");
    })
});

module.exports = router;