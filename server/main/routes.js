var express = require('express')
var router = express.Router()
var pool = require('./db')

router.get('/api/hello', (req, res) => {
	res.json('hello world')
})

// Get all cities
router.get('/api/get/cities', (req,res,next) => {
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

// Get coordinates
router.get('/api/get/trees', (req,res,next) => {
	pool.query(`select * from public.standard_dataset
	    where earth_box(ll_to_earth(${req.query.lat}, ${req.query.lng}),
	    (${req.query.radius})
	    ) @> ll_to_earth(latitude, longitude) limit ${req.query.limit}`,
		(q_err, q_res) => {
			res.json(q_res.rows)
		})
})

module.exports = router