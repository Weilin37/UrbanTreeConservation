import { useSelector } from "react-redux";
import { useLeaflet, Circle } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

const GetMarkers = () => {
    const stateMarker = useSelector(state => state.marker);
    const { map } = useLeaflet();
    const zoom = map.getZoom();

    if (stateMarker.view_status == "cities"){
        return stateMarker.cities.map((el, i) => (
          <Marker
            key={i}
            position={[el.latitude, el.longitude]}
          >
            <Popup>
                <p>City: {el.city}</p>
                <p>State: {el.state}</p>
                <p>Number of Trees: {el.num_trees}</p>
            </Popup>
          </Marker>
        ));
    } else if (stateMarker.view_status == "cluster")  {
        return (
            <MarkerClusterGroup disableClusteringAtZoom={stateMarker.treeZoom} spiderfyOnMaxZoom={false}>
                {stateMarker.trees.map((el, i) => (
                  <Circle key={i} center={[el.latitude, el.longitude]} radius={5} color={"green"}>
                    <Popup>
                        <p>City: {el.city}</p>
                        <p>State: {el.state}</p>
                        <p>Scientific Name: {el.scientific_name}</p>
                        <p>Native: {el.native}</p>
                        <p>Condition: {el.condition}</p>
                        <p>Diameter Breast Height (CM): {el.diameter_breast_height_cm}</p>
                    </Popup>
                  </Circle>
                ))}
            </MarkerClusterGroup>
        )
    }
};

export default GetMarkers;