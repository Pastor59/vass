import express from 'express';
import {filterById} from '../middlewares/authmiddleware';
import DataController from '../controllers/data';

const router = express.Router();

router.get('/:id', filterById, (req, res, next) => {
    DataController.userDataByUserId(req.client.id)
    .then(policies =>{
        res.send(policies);
    })
    .catch(err => {
        res.send(err);
    })
});

module.exports = router;