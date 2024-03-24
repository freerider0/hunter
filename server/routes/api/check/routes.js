import getHabitacliaPropertyData from '../../../scrappers/puppetters/habitaclia.js'
import express from 'express';

const router = express.Router();


router.get('/habitaclia', function(req, res) {
    const data = getHabitacliaPropertyData()
    res.send('home page');
});
export default router