import express from 'express';
import {
    getProperties,
    getTotalPriceOfAllProperties,
    getPropertyById,
    getHashOfFilteredProperties,
    getPropertyTypes
} from "../../../databases/mongodb/getDataQueries.js";
import {
    setPropertiesReadyForSearchForContactDetails,
} from "../../../databases/mongodb/setDataQueries.js";

const router = express.Router();

// http://localhost:3000/api/property/types

router.get('/listing', async (req, res) => {

    const result = await getProperties(req.query)
    res.status(200).json(result)
});

router.get('/types', async (req, res) => {

    const result = await getPropertyTypes(req.query)
    res.status(200).json(result)
});

router.get('/get-hash-of-filtered-properties', async (req, res) => {

    const result = await getHashOfFilteredProperties(req.query)
    res.status(200).json(result)
});


router.get('/get-total-price-of-all-prperties', async (req, res) => {

    const result = await getTotalPriceOfAllProperties()
    res.status(200).json(result)
});




router.get('/precios-medios', async (req, res) => {
    //extractPricesDataFotocasa()
});

router.get('/:platformHash', async (req, res) => {
    const result = await getPropertyById(req.params.platformHash)
    res.status(200).json(result)
});

router.post('/set-properties-ready-for-search-for-contact-details', async (req, res) => {
    const hashes = req.body.platform_hashes;
    if (!Array.isArray(hashes) || hashes.length === 0) {
        return res.status(400).send({ message: 'Invalid input' });
    }
    const result = await setPropertiesReadyForSearchForContactDetails(hashes)
    res.status(200).json(result)
});


export default router