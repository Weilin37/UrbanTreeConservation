import { useDispatch, useSelector, batch } from "react-redux";
import { Circle } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { renderToString } from 'react-dom/server';
import PixiOverlay from 'react-leaflet-pixi-overlay';
import Slider from '@material-ui/core/Slider';
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
                <p>{el.city}, {el.state}</p>
                <p>Number of Trees: {el.total_species}</p>
                <p>Number of Species: {el.total_unique_species}</p>
                <Box pb={4} />
                <Slider
                    defaultValue={el.count_native}
                    step={null}
                    min={0}
                    max={el.total_species}
                    valueLabelDisplay="on"
                    marks={
                        [
                          {value: el.count_native,label: 'Native'},
                          {value: el.total_species, label: (el.total_species/1000).toFixed()+"K"}
                        ]
                    }
                />
                <Button onClick={() => handleClick(el.city, el.state)} value={el.city} variant="outlined" size="small" color="primary">
                  Compare
                </Button>
            </Popup>
          </Marker>
        ));
    } else if (stateMarker.view_status === "city")  {
        return (
            <PixiOverlay markers={stateMarker.city} />
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
                    </Popup>
                  </Circle>
                ));
    } else {
        return null
    }
};

export default GetMarkers;