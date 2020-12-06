var express = require('express')
var router = express.Router()
var pool = require('./db')

router.get('/api/hello', (req, res) => {
	res.json('hello world')
})

// Get all cities
router.get('/api/get/cities', (req,res,next) => {
	pool.query(`select distinct city, state from public.standard_dataset`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
})

// Get coordinates
router.get('/api/get/markers', (req,res,next) => {
	pool.query(`select distinct latitude, longitude from public.standard_dataset limit 100`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
})

module.exports = router