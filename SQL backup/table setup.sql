CREATE EXTENSION cube;
CREATE EXTENSION earthdistance;
CREATE EXTENSION postgis;

ALTER TABLE public.standard_dataset
ALTER COLUMN latitude_coordinate TYPE numeric USING NULLIF(latitude_coordinate, '')::numeric;

ALTER TABLE public.standard_dataset
ALTER COLUMN longitude_coordinate TYPE numeric USING NULLIF(longitude_coordinate, '')::numeric;

ALTER TABLE public.standard_dataset ADD COLUMN geom geometry(Point, 4326);
UPDATE public.standard_dataset SET geom = ST_SetSRID(ST_MakePoint(longitude_coordinate, latitude_coordinate), 4326);

CREATE INDEX ON standard_dataset USING gist (ll_to_earth(latitude_coordinate, longitude_coordinate));

CREATE INDEX metro_index ON public.standard_dataset_new (greater_metro);

CREATE INDEX metro_index_lower ON public.standard_dataset_new (lower(greater_metro));

create table metro_species_count
as
select greater_metro, scientific_name, count(scientific_name)
from public.standard_dataset_new
group by greater_metro,scientific_name

create table city_stats
as
select a.greater_metro, b.latitude, b.longitude,
count(scientific_name) as total_sp ecies,
count(distinct scientific_name) as total_unique_species,
count(CASE WHEN native = 'TRUE' THEN 1 END) as count_native,
count(CASE WHEN native = 'FALSE' THEN 1 END) as count_non_native
from public.standard_dataset_new a
left join public.metro_coordinates b
on a.greater_metro = b.greater_metro
group by a.greater_metro, b.latitude, b.longitude

create table public.dice_similarity
AS
select
geo.greater_metro1,
geo.greater_metro2,
ROUND(
(
    select 2*count(*)
    from (select distinct scientific_name from public.standard_dataset where lower(greater_metro) = lower(geo.greater_metro1)) a
    inner join (select distinct scientific_name from public.standard_dataset where lower(greater_metro) = lower(geo.greater_metro2)) b
    on a.scientific_name = b.scientific_name
)::numeric
/
(
    (select count(distinct scientific_name)
    from public.standard_dataset
    where lower(greater_metro) = lower(geo.greater_metro1))
    +
    (select count(distinct scientific_name)
    from public.standard_dataset
    where lower(greater_metro) = lower(geo.greater_metro2))
)::numeric
, 4 ) as ds_similarity
FROM 
(       
	select distinct A.greater_metro as greater_metro1, B.greater_metro as greater_metro2
	from (select distinct greater_metro from public.metro_coordinates) A 
	inner join (select distinct greater_metro from public.metro_coordinates) B 
	on A.greater_metro > B.greater_metro
) geo


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

select city1, state1, city2, state2, ds_similarity
from public.dice_similarity
where (
        state1 in ('${req.query.state1}','${req.query.state2}') and city1 in ('${req.query.city1}','${req.query.city2}')
    )
and (
    state2 in ('${req.query.state1}','${req.query.state2}') and city2 in ('${req.query.city1}','${req.query.city2}')
)

select ds_similarity as x from public.dice_similarity;