const ALL_SPOTS = 'spots/ALL_SPOTS'
const DETAIL_SPOTS = 'spots/DETAIL_SPOTS'

export const allSpot = (spots) => {
    return {
        type: ALL_SPOTS,
        spots
    }
}

export const detailSpot = (spots) => {
    return {
        type:DETAIL_SPOTS,
        spots
    }
}

export const getDetail = (id) => async dispatch => {
    const response = await fetch(`/api/spots/${id}`)
    const data = await response.json()
    dispatch(detailSpot(data))
    return response
}

export const getSpot = () => async dispatch => {
    const response = await fetch('/api/spots')
    const data = await response.json()
    dispatch(allSpot(data))
    return response
}

const initialState = {}

const spotReducer = (state = initialState, action) => {
    switch(action.type){
        case ALL_SPOTS:
            return {...state, ...action.spots}
        case DETAIL_SPOTS:
            return{...state, spotDetail: action.spots}
    default:
        return state
    }
}

export default spotReducer
