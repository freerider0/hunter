import express from 'express';
import * as redisControl from "../../../redisControl.js";
import {pool} from "../../../postgres.js";
import {imageHash} from 'image-hash';

const router = express.Router();

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});


// Define the home page route
router.get('/', function(req, res) {

    res.send('home page');
});

router.get('/start-scrape', async function(req, res) {
    await redisControl.startScrape()
    res.send('scraping started');
});

router.get('/is-scraping-enabled', async function(req, res) {
    const scrapingStatus= await redisControl.canScrape()
    res.send({responseCode:200, scrapingEnabled:scrapingStatus});
});

router.get('/stop-scrape', async function(req, res) {
    await redisControl.stopScrape()
    res.send('scraping stoped');
});


router.get('/actualizarAbstenerse', async function(req, res){
    const query = `
    UPDATE property
    SET abstenerse = CASE
      -- Condición para asignar 100
      WHEN long_description ~* '(abstenerse|no).*(agencias|intermediarios|inmobiliarias)|(agencias|intermediarios|inmobiliarias).*(abstenerse|no)' THEN 100
      -- Condición para asignar 50
      WHEN long_description ILIKE '%agencias%'
            OR long_description ILIKE '%intermediarios%'
            OR long_description ILIKE '%inmobiliarias%' THEN 50
      -- Caso por defecto
      ELSE 0
    END;
  `;

    try {
        const res = await pool.query(query);
        console.log('Actualización completada:', res.rowCount, 'filas afectadas');

    } catch (err) {
        console.error('Error al actualizar la tabla property:', err);
        res.json({status:500, message: 'error al actualizar los registros'})
    }
    res.json({status:200, message: 'abstenerse actualizado en todos los registros'})

})

router.get('/calcular-hashes-imagenes', function(req, res) {

    res.send('hashes calculados');
});

export default router