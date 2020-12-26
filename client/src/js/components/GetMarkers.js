import { useDispatch, useSelector, batch } from "react-redux";
import { Circle } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import Button from '@material-ui/core/Button';
import MarkerClusterGroup from "react-leaflet-markercluster";
import { setSimilarityCity1, setSimilarityCity2, setSimilarityState1, setSimilarityState2 } from "../features/analysisSlice";

const GetMarkers = () => {
    const stateMarker = useSelector(state => state.marker);
    const stateAnalysis = useSelector(state => state.analysis);
    const dispatch = useDispatch();

    function handleClick(city, state) {
        if (stateAnalysis.similarityCity1 === "") {
            batch(() => {
                dispatch(setSimilarityCity1(city));
                dispatch(setSimilarityState1(state));
            });
        } else if (stateAnalysis.similarityCity2 === "") {
            batch(() => {
                dispatch(setSimilarityCity2(city));
                dispatch(setSimilarityState2(state));
            });
        }
    }

    if (stateMarker.view_status === "global"){
        return stateMarker.global.map((el, i) => (
          <Marker
            key={i}
            position={[el.latitude, el.longitude]}
          >
            <Popup>
                <p>City: {el.city}</p>
                <p>State: {el.state}</p>
                <p>Number of Trees: {el.num_trees}</p>
                <Button onClick={() => handleClick(el.city, el.state)} value={el.city} variant="outlined" size="small" color="primary">
                  Compare
                </Button>
            </Popup>
          </Marker>
        ));
    } else if (stateMarker.view_status === "city")  {
        return (
            <MarkerClusterGroup disableClusteringAtZoom={stateMarker.treeZoom} spiderfyOnMaxZoom={false}>
                {stateMarker.city.map((el, i) => (
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
    } else if (stateMarker.view_status === "freedraw") {
        return stateMarker.freedraw.map((el, i) => (
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
                ));
    } else {
        return null
    }
};

export default GetMarkers;