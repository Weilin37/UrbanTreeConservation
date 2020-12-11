import { useSelector } from "react-redux";
import { useLeaflet, Circle } from "react-leaflet";

// Custom map components
const DrawBounds = () => {
    const stateMarker = useSelector(state => state.marker);
    const { map } = useLeaflet();
    const zoom = map.getZoom();
    const center = map.getCenter();
    const lat = center.lat;
    const lng = center.lng;

    if (stateMarker.view_status == "cluster") {
        return <Circle
                weight={1}
                opacity={0.5}
                fill={false}
                center={[lat, lng]}
                radius={stateMarker.scan_radius} />
    } else {
        return null
    }
}

export default DrawBounds;