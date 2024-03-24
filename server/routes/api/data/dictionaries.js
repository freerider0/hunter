import {getPropertyTypes} from "../../../databases/mongodb/getDataQueries.js";
import express from 'express';



const router = express.Router();

router.get('/propertyTypes', async function(req, res){


    try {
        const localidades = await getPropertyTypes()
        res.status(200).json(localidades)


    } catch (err) {
        console.error('Error en la consulta de localidades:', err);
        res.json({status:500, message: 'Error en la consulta de localidades'})
    }

})

export default router