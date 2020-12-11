import { useSelector } from "react-redux";
import { useLeaflet, Circle } from "react-leaflet";

// Custom map components
const DrawBounds = () => {
    const stateMap = useSelector(state => state.map);
    const stateMarker = useSelector(state => state.marker);
    const { map } = useLeaflet();
    console.log(map);

    if (stateMap.zoom >= 10) {
        return <Circle
                weight={1}
                opacity={0.5}
                fill={false}
                center={[stateMap.lat, stateMap.lng]}
                radius={stateMarker.radius} />
    } else {
        return null
    }
}

export default DrawBounds;