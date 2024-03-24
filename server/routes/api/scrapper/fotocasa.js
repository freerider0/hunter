import {pool} from "../../../postgres.js";
import express from 'express';
import {locationSuggestFotocasa} from "../../../scrappers/fotocasa/precios.js";

const router = express.Router();

router.get('/locations/:query', async (req, res) => {
    let { query } = req.params;

    try {
        const result = await locationSuggestFotocasa(query)
        res.send(result)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



export default router