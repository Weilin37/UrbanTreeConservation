import { useSelector } from "react-redux";
import { useLeaflet, Circle } from "react-leaflet";

// Custom map components
const DrawBounds = () => {
    const stateMarker = useSelector(state => state.marker);
    const { map } = useLeaflet();
    const zoom = map._zoom;
    const center = map._lastCenter;
    const lat = center.lat;
    const lng = center.lng;
    console.log(map);

    if (zoom >= stateMarker.clusterZoom) {
        return <Circle
                weight={1}
                opacity={0.5}
                fill={false}
                center={[lat, lng]}
                radius={stateMarker.radius} />
    } else {
        return null
    }
}

export default DrawBounds;