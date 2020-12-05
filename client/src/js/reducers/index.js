import { GET_LATLNG } from "../constants/action-types";

const initialState = {
  latlng: []
};

function latlngReducer(state = initialState, action) {
    switch(action.type) {
        case GET_LATLNG:
            return Object.assign({}, state, {
                latlng: state.latlng.concat(action.payload)
            })
        default:
            return state
    }
}

export default latlngReducer