var express = require('express')
var router = express.Router()
var pool = require('./db')

// Get global level data
router.get('/api/get/global', (req,res,next) => {
	pool.query(`select city,
	    state,
	    avg(latitude) as latitude,
	    avg(longitude)as longitude,
	    count(latitude) as num_trees
	    from public.standard_dataset
	    group by city, state`,
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
    console.log(`select
        ROUND(
        (
            select 2*count(*)
            from (select distinct scientific_name from public.standard_dataset where lower(state) = lower('${req.query.state1}') and lower(city) = lower('${req.query.city1}')) a
            inner join (select distinct scientific_name from public.standard_dataset where lower(state) = lower('${req.query.state2}') and lower(city) = lower('${req.query.city2}')) b
            on a.scientific_name = b.scientific_name
        )::numeric
        /
        (
            (select count(distinct scientific_name)
            from public.standard_dataset
            where lower(state) = lower('${req.query.state1}')
            and lower(city) = lower('${req.query.city1}'))
            +
            (select count(distinct scientific_name)
            from public.standard_dataset
            where lower(state) = lower('${req.query.state2}')
            and lower(city) = lower('${req.query.city2}'))
        )::numeric
        ,4 )`)


	pool.query(
        `select
        ROUND(
        (
            select 2*count(*)
            from (select distinct scientific_name from public.standard_dataset where lower(state) = lower('${req.query.state1}') and lower(city) = lower('${req.query.city1}')) a
            inner join (select distinct scientific_name from public.standard_dataset where lower(state) = lower('${req.query.state2}') and lower(city) = lower('${req.query.city2}')) b
            on a.scientific_name = b.scientific_name
        )::numeric
        /
        (
            (select count(distinct scientific_name)
            from public.standard_dataset
            where lower(state) = lower('${req.query.state1}')
            and lower(city) = lower('${req.query.city1}'))
            +
            (select count(distinct scientific_name)
            from public.standard_dataset
            where lower(state) = lower('${req.query.state2}')
            and lower(city) = lower('${req.query.city2}'))
        )::numeric
        ,4 ) as ds_similarity`,
		(q_err, q_res) => {
		    console.log(q_res.rows);
			res.json(q_res.rows)
		})
})

module.exports = router