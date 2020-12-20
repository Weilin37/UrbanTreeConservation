CREATE EXTENSION cube;
CREATE EXTENSION earthdistance;
CREATE EXTENSION postgis;

ALTER TABLE public.standard_dataset ADD COLUMN geom geometry(Point, 4326);
UPDATE public.standard_dataset SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326);

select city,
	state,
	avg(latitude) as latitude,
	avg(longitude)as longitude,
	count(latitude) as num_trees
	from public.standard_dataset
	group by city, state

select * from public.standard_dataset
    where earth_box(ll_to_earth(${req.query.lat}, ${req.query.lng}),
    (${req.query.radius})
    ) @> ll_to_earth(latitude, longitude) limit ${req.query.limit}

SELECT latitude, longitude
FROM public.standard_dataset
WHERE ST_CONTAINS(ST_GeomFromEWKT('SRID=4326; POLYGON((-122.35866308212282 47.67823259604642 ,-122.35703229904176 47.676397755374985,-122.36085176467897 47.675343053974366,  -122.36353397369386 47.67742354039624,-122.35866308212282 47.67823259604642))'),geom)
