var express = require('express')
var router = express.Router()
var pool = require('./db')

// Get global level data
router.get('/api/get/global', (req,res,next) => {
	pool.query(`select * from public.city_stats_new`,
		(q_err, q_res) => {
			res.json(q_res.rows)
    })
})

// Get city level data
router.get('/api/get/city', (req,res,next) => {
	pool.query(`select
	    row_number() OVER () as id,
	    city,
	    state,
	    greater_metro,
	    latitude_coordinate as latitude,
	    longitude_coordinate as longitude,
	    scientific_name,
	    '<div><p>Scientific Name: ' || scientific_name || '</p><p>Common Name: '|| common_name ||'</p></div>' as tooltip,
	    native,
	    case
	        when native='TRUE' then 1
	        else 0
	    end as native_flag
	    from public.standard_dataset_new
	    where greater_metro = (
	        select greater_metro
	        from public.standard_dataset_new
	        where earth_box(ll_to_earth(${req.query.lat}, ${req.query.lng}),(${req.query.radius})) @> ll_to_earth(latitude_coordinate, longitude_coordinate)
	        limit 1
	    )`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
})

// Get trees in polygon
router.get('/api/get/freedraw', (req,res,next) => {
	pool.query(`select city,
	    state,
	    native,
	    scientific_name,
	    condition,
	    latitude_coordinate as latitude,
	    longitude_coordinate as longitude
	    from public.standard_dataset_new
	    where earth_box(ll_to_earth(${req.query.lat}, ${req.query.lng}),
	    (${req.query.radius})
	    ) @> ll_to_earth(latitude_coordinate, longitude_coordinate)
	    AND ST_CONTAINS(ST_GeomFromEWKT('SRID=4326; POLYGON((${req.query.polygons}))'),geom)`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
})

// Get similarity between two cities
router.get('/api/get/citysimilarity', (req,res,next) => {
	pool.query(
        `select greater_metro1, greater_metro2, ds_similarity
        from public.dice_similarity_new
        where (
        		greater_metro1 in ('${req.query.greater_metro1}','${req.query.greater_metro2}')
        	)
        and (
        	greater_metro2 in ('${req.query.greater_metro1}','${req.query.greater_metro2}')
      	)`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
});

// Get similarity histogram
router.get('/api/get/similarityhistogram', (req,res,next) => {
	pool.query(
        `select ds_similarity as x from public.dice_similarity_new`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
});

module.exports = router