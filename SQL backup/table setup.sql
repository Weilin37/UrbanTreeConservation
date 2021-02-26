CREATE EXTENSION cube;
CREATE EXTENSION earthdistance;
CREATE EXTENSION postgis;

ALTER TABLE public.standard_dataset ADD COLUMN geom geometry(Point, 4326);
UPDATE public.standard_dataset SET geom = ST_SetSRID(ST_MakePoint(longitude_coordinate, latitude_coordinate), 4326);

CREATE INDEX ON standard_dataset USING gist (ll_to_earth(latitude_coordinate, longitude_coordinate));

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
    ) @> ll_to_earth(latitude_coordinate, longitude_coordinate) limit ${req.query.limit}

select * from public.standard_dataset
	    where earth_box(ll_to_earth(${req.query.lat}, ${req.query.lng}),
	    (${req.query.radius})
	    ) @> ll_to_earth(latitude_coordinate, longitude_coordinate)
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

select city1, state1, city2, state2, ds_similarity
from public.dice_similarity
where (
        state1 in ('${req.query.state1}','${req.query.state2}') and city1 in ('${req.query.city1}','${req.query.city2}')
    )
and (
    state2 in ('${req.query.state1}','${req.query.state2}') and city2 in ('${req.query.city1}','${req.query.city2}')
)

select ds_similarity as x from public.dice_similarity;

create table city_stats
as
select city,
state,
avg(latitude_coordinate) as latitude,
avg(longitude_coordinate)as longitude,
count(scientific_name) as total_species,
count(distinct scientific_name) as total_unique_species,
count(CASE WHEN native = 'TRUE' THEN 1 END) as count_native,
count(CASE WHEN native = 'FALSE' THEN 1 END) as count_non_native
from public.standard_dataset
group by state, city