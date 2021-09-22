const express = require('express');
const router = express.Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Crest Infosystems: Enterprise Software Development Company',description:'Crest Infosystems is a full-service custom software development company in USA India. We deliver enterprise IT software solutions and services globally.', link: 'http://crestinfosystems.net' });
});

module.exports = router;
