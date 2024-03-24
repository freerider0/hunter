import express from 'express';
import {scrapeaComunidades} from '../../../scrappers/departiculares.js'

const router = express.Router();



// Define the home page route
router.get('/comunidades', async function(req, res) {
    const comunidades = await scrapeaComunidades()
    res.send(comunidades);
});

export default router
