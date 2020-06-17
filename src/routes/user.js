import express from 'express';
import {filterById, filterByName} from '../middlewares/authmiddleware';

const router = express.Router();

router.get('/:id', filterById, (req, res, next) => {
    res.send(req.client);
});

router.get('/', filterByName, (req, res, next) => {
    res.send(req.client);
});

module.exports = router;