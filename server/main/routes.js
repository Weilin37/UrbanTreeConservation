var express = require('express')
var router = express.Router()
var pool = require('./db')

// Get global level data
router.get('/api/get/global', (req,res,next) => {
	pool.query(`select * from public.city_stats`,
		(q_err, q_res) => {
			res.json(q_res.rows)
    })
})

// Get city level data
router.get('/api/get/city', (req,res,next) => {
	pool.query(`select * from public.standard_dataset
	    where earth_box(ll_to_earth(${req.query.lat}, ${req.query.lng}),
	    (${req.query.radius})
	    ) @> ll_to_earth(latitude, longitude) limit ${req.query.limit}`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
})

// Get trees in polygon
router.get('/api/get/freedraw', (req,res,next) => {
	pool.query(`select * from public.standard_dataset
	    where earth_box(ll_to_earth(${req.query.lat}, ${req.query.lng}),
	    (${req.query.radius})
	    ) @> ll_to_earth(latitude, longitude)
	    AND ST_CONTAINS(ST_GeomFromEWKT('SRID=4326; POLYGON((${req.query.polygons}))'),geom)`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
})

// Get similarity between two cities
router.get('/api/get/citysimilarity', (req,res,next) => {
	pool.query(
        `select city1, state1, city2, state2, ds_similarity
        from public.dice_similarity
        where (
        		state1 in ('${req.query.state1}','${req.query.state2}') and city1 in ('${req.query.city1}','${req.query.city2}')
        	)
        and (
        	state2 in ('${req.query.state1}','${req.query.state2}') and city2 in ('${req.query.city1}','${req.query.city2}')
      	)`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
});

// Get similarity histogram
router.get('/api/get/similarityhistogram', (req,res,next) => {
	pool.query(
        `select ds_similarity as x from public.dice_similarity`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
});

module.exports = router