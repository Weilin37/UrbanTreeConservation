import { useSelector } from "react-redux";
import { Circle } from "react-leaflet";

// Custom map components
const DrawBounds = () => {
    const stateMarker = useSelector(state => state.marker);

    if (stateMarker.view_status === "city") {
        return <Circle
                weight={1}
                opacity={0.5}
                fill={false}
                center={[stateMarker.scan_lat, stateMarker.scan_lng]}
                radius={1.5*stateMarker.scan_radius} />
    } else {
        return null
    }
}

export default DrawBounds;