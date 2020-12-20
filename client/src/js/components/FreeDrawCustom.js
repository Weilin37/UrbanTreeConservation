import React, {useRef} from "react";
import Freedraw, { ALL, EDIT, CREATE, DELETE, NONE } from 'react-leaflet-freedraw';
import "../../css/freedraw.css";
import { useDispatch, useSelector, batch } from "react-redux";
import { setDrawModeButton, setDrawMode } from "../features/mapSlice";

// Custom map components
const FreeDrawCustom = () => {
    const dispatch = useDispatch();
    const stateMarker = useSelector(state => state.marker);
    const stateMap = useSelector(state => state.map);

    const freeDrawRef = useRef(null);

    // Listen for any markers added, removed or edited, and then output the lat lng boundaries.
    function handleOnMarkers(e) {
        console.log(
          'LatLngs:',
          e.latLngs,
          'Polygons:',
        );
    };

    function handleModeChange(e) {
        console.log('mode changed', e.mode);

        /*if (e.mode == 14) {
            batch(() => {
                setDrawModeButton(false);
                setDrawMode(14);
            });
        }*/
    };

    return (
        <Freedraw
          mode={stateMap.draw_mode}
          onMarkers={handleOnMarkers}
          onModeChange={handleModeChange}
          ref={freeDrawRef}
        />
    )

}

export default FreeDrawCustom;