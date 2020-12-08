var express = require('express')
var router = express.Router()
var pool = require('./db')

router.get('/api/hello', (req, res) => {
	res.json('hello world')
})

// Get all cities
router.get('/api/get/cities', (req,res,next) => {
	pool.query(`select city, state, avg(cast(latitude as float)) as latitude, avg(cast(longitude as float))as longitude, count(latitude) as num_trees from public.standard_dataset where latitude is not null and longitude is not null group by city, state`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
})

// Get coordinates
router.get('/api/get/markers', (req,res,next) => {
	pool.query(`select * from public.standard_dataset where latitude is not null and longitude is not null limit 100`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
})

// Get search latlng
router.get('/api/get/search', (req,res,next) => {
	pool.query(`select * from public.standard_dataset where latitude is not null and longitude is not null limit 100`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
})

module.exports = router