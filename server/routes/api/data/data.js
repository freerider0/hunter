import express from 'express';
import * as redisControl from "../../../redisControl.js";
import {pool} from "../../../postgres.js";
import {obtenerZonasDistintas} from "../../../databases/mongodb/getDataQueries.js";

const router = express.Router();


// /api/data

router.get('/localidades', async function(req, res){


    try {
        const localidades = await obtenerZonasDistintas()
        res.status(200).json(localidades)


    } catch (err) {
        console.error('Error en la consulta de localidades:', err);
        res.json({status:500, message: 'Error en la consulta de localidades'})
    }

})

router.get('/portales', async function(req, res){
    const query = `
    SELECT DISTINCT portal FROM property;
  `;

    try {
        const queryResult = await pool.query(query);
        console.log('Actualización completada:', queryResult.rows, 'filas afectadas');
        let portales = [

        ]
        queryResult.rows.forEach(portal=>{
            portales.push(portal.portal)
        })
        res.status(200).json({data: portales})


    } catch (err) {
        console.error('Error en la consulta de localidades:', err);
        res.json({status:500, message: 'Error en la consulta de localidades'})
    }

})


export default router