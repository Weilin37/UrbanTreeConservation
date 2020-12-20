import React, {useRef} from "react";
import Freedraw from 'react-leaflet-freedraw';
import "../../css/freedraw.css";
import { useSelector, useDispatch } from "react-redux";
import { setEndpoint } from "../features/markerSlice";

// Custom map components
const FreeDrawCustom = () => {
    const stateMap = useSelector(state => state.map);
    const dispatch = useDispatch();
    const freeDrawRef = useRef(null);

    // Listen for any markers added, removed or edited, and then output the lat lng boundaries.
    function handleOnMarkers(e) {
        if (e.latLngs.length > 0){
            const coordinates = e.latLngs[0];
            console.log(coordinates);
            let polygonArray = [];
            for (var i = 0; i<coordinates.length; i++) {
                let lng = coordinates[i].lng;
                let lat = coordinates[i].lat;
                let string = lng+' '+lat;
                polygonArray.push(string);
            }
            polygonArray.push(coordinates[0].lng+' '+coordinates[0].lat);

            let polygonString = polygonArray.join(',');
            dispatch(setEndpoint({type:"freedraw", polygons:polygonString}));
        }
    };

    function handleModeChange(e) {
        console.log('mode changed', e.mode);
    };

    return (
        <Freedraw
          mode={stateMap.draw_mode}
          onMarkers={handleOnMarkers}
          onModeChange={handleModeChange}
          ref={freeDrawRef}
          leaveModeAfterCreate={true}
        />
    )

}

export default FreeDrawCustom;