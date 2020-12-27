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

select * from public.standard_dataset
	    where earth_box(ll_to_earth(${req.query.lat}, ${req.query.lng}),
	    (${req.query.radius})
	    ) @> ll_to_earth(latitude, longitude)
	    AND ST_CONTAINS(ST_GeomFromEWKT('SRID=4326; POLYGON((${req.query.polygons}))'),geom)


select
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
,4 ) as ds_similarity



create table public.dice_similarity
AS
select
geo.city1,
geo.state1,
geo.city2,
geo.state2,
ROUND(
(
    select 2*count(*)
    from (select distinct scientific_name from public.standard_dataset where lower(state) = lower(geo.state1) and lower(city) = lower(geo.city1)) a
    inner join (select distinct scientific_name from public.standard_dataset where lower(state) = lower(geo.state2) and lower(city) = lower(geo.city2)) b
    on a.scientific_name = b.scientific_name
)::numeric
/
(
    (select count(distinct scientific_name)
    from public.standard_dataset
    where lower(state) = lower(geo.state1)
    and lower(city) = lower(geo.city1))
    +
    (select count(distinct scientific_name)
    from public.standard_dataset
    where lower(state) = lower(geo.state2)
    and lower(city) = lower(geo.city2))
)::numeric
,4 ) as ds_similarity
FROM 
(       
	select distinct A.city as city1, A.state as state1, B.city as city2, B.state as state2
	from (select distinct city, state from public.standard_dataset) A 
	inner join (select distinct city, state from public.standard_dataset) B 
	on A.city||A.state > B.city||B.state
) geo


