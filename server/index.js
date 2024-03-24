import 'dotenv/config'
import express from 'express'
const app = express()
import {extractData, scrapeAllPages} from './scrappers/departiculares.js'
import cors from 'cors'
import {pool} from "./postgres.js";
const port = 3000
import * as redis from './redisControl.js'
import apiControlRouter from './routes/api/control/scrape.js'
import apiScrapersRouter from './routes/api/scrapper/departiculares.js'
import apiCheckRouter from './routes/api/check/routes.js'
import apiDataRouter from './routes/api/data/data.js'
import apiPropertyRouter from './routes/api/data/properties.js'
import apiFotocasaRouter from './routes/api/scrapper/fotocasa.js'


import {canScrape} from "./redisControl.js";
import apiDictionaries from './routes/api/data/dictionaries.js'

app.use(cors())
// Middleware para parsear el cuerpo JSON de las solicitudes entrantes
app.use(express.json());

app.use('/api/check', apiCheckRouter);
app.use('/api/scrapers', apiScrapersRouter);
app.use('/api/control', apiControlRouter);
app.use('/api/dictionaries', apiDictionaries)
app.use('/api/control', apiControlRouter);
app.use('/api/data', apiDataRouter);
app.use('/api/property', apiPropertyRouter)
app.use('/api/fotocasa/', apiFotocasaRouter)



app.get('/', async (req, res) => {
    // URL de la página a scrapear
    res.send('hola')
})

app.get('/next', async (req, res) => {
    // URL de la página a scrapear
    res.json({url: 'https://www.fotocasa.es/es/comprar/vivienda/barcelona-capital/aire-acondicionado-calefaccion-ascensor-amueblado/176332589/d'})
})



app.get('/scrape', async (req, res) => {
    // URL de la página a scrapear
    await redis.startScrape()
    console.log('redis', redis.canScrape())
    const url = 'https://www.departiculares.com/venta/barcelona?order=priceMax&page=13';
    const data = await scrapeAllPages();
    res.send(data)
})

app.get('/properties', async (req, res) => {
    let { limit, page, localidad, precioMin, precioMax, portal, abstenerse } = req.query;
    limit = parseInt(limit, 10) || 100; // Por defecto, 100 elementos por página
    page = parseInt(page, 10) || 1; // Por defecto, página 1
    limit = limit > 100 ? 100 : limit; // limita el máximo de elementos por página a 100
    page = page < 1 ? 1 : page;
    const offset = (page - 1) * limit;

    // Construir la consulta SQL dinámicamente
    let queryParams = [];
    let whereClauses = [];
    let queryBase = 'FROM property';

    if (localidad) {
        queryParams.push(localidad);
        whereClauses.push(`localidad = $${queryParams.length}`);
    }

    if (precioMin) {
        queryParams.push(precioMin);
        whereClauses.push(`precio >= $${queryParams.length}`);
    }

    if (precioMax) {
        queryParams.push(precioMax);
        whereClauses.push(`precio <= $${queryParams.length}`);
    }

    if (portal) {
        queryParams.push(portal);
        whereClauses.push(`portal = $${queryParams.length}`);
    }

    if (abstenerse) {
        queryParams.push(abstenerse);
        whereClauses.push(`abstenerse = $${queryParams.length}`);
    }

    if (whereClauses.length > 0) {
        queryBase += ' WHERE ' + whereClauses.join(' AND ');
    }

    try {
        // Obtener el total de registros para calcular el total de páginas
        const totalRes = await pool.query(`SELECT COUNT(*) AS total ${queryBase}`, queryParams);
        const total = parseInt(totalRes.rows[0].total, 10);
        const totalPages = Math.ceil(total / limit);

        const propertiesRes = await pool.query(`SELECT * ${queryBase} ORDER BY precio DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`, [...queryParams, limit, offset]);

        res.status(200).json({
            data: propertiesRes.rows,
            currentPage: page,
            totalPages,
            totalItems: total,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})