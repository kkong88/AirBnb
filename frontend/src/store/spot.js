const ALL_SPOTS = 'spots/ALL_SPOTS'


export const allSpot = (spots) => {
    return {
        type: ALL_SPOTS,
        spots
    }
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
    default:
        return state
    }
}

export default spotReducer
