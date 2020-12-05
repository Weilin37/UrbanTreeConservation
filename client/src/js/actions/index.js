// src/js/actions/index.js

import { GET_LATLNG } from "../constants/action-types";

export function get_latlng() {
    return function(dispatch) {
        return fetch("/api/latlng")
            .then(response => response.json())
            .then(json => {
                dispatch({type: GET_LATLNG, payload: json});
            });
    };
}