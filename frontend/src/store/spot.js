import { csrfFetch } from "./csrf"

const ALL_SPOTS = 'spots/ALL_SPOTS'
const DETAIL_SPOTS = 'spots/DETAIL_SPOTS'
const CREATE_SPOTS = 'spots/CREATE_SPOTS'
const UPDATE_SPOTS = 'spots/UPDATE_SPOTS'
const DELETE_SPOTS = 'spots/DELETE_SPOTS'



export const makeSpot = (spots) => {
    return {
        type:CREATE_SPOTS,
        spots
    }
}

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

export const updateASpot = (spots) => {
    return{
        type: UPDATE_SPOTS,
        spots
    }
}

export const deleteASpot = (spotId) => {
    return {
        type: DELETE_SPOTS,
        spotId
    }
}

export const createSpot = (spots) => async (dispatch) => {
    const { name, state, country, city, address, description, price, images } = spots

    let response = await csrfFetch('/api/spots', {
        method: "POST",
        body: JSON.stringify({
            name,
            state,
            country,
            city,
            address,
            description,
            price,
            lat:11.11,
            lng:12.12,
        }),
    })

    if(response.ok){
    const data = await response.json()
    dispatch(makeSpot(data))
    for await(let image of images){
        let imageRes = await csrfFetch(`/api/spots/${data.id}/images`,{
            method: "POST",
            body: JSON.stringify({
               url: image,
               preview: true
            })
        })
        if(imageRes.ok){
            imageRes = await imageRes.json()
        }
    }
    return data
    }
}

export const getDetail = (id) => async dispatch => {
    const response = await fetch(`/api/spots/${id}`)
    if(response.ok){
        const data = await response.json()
        dispatch(detailSpot(data))
        return response
    }
}

export const updateSpot = (spotId, spots) => async (dispatch) => {
    console.log(spots, spotId)
    const response = await csrfFetch(`/api/spots/${spotId}`,{
        method: "PUT",
        body: JSON.stringify(spots)
    })
    console.log(response)
    if(response.ok){
        const spot = await response.json()
        dispatch(updateASpot(spot))
        return spot
    }
}

export const getSpot = () => async dispatch => {
    const response = await fetch('/api/spots')
    const data = await response.json()
    dispatch(allSpot(data))
    return response
}

export const deleteSpot = (spotId) => async dispatch => {
    console.log(spotId)
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    })
    if(response.ok){
        const data = await response.json()
        dispatch(deleteASpot(spotId))
        return data
    }
}

const initialState = {}

const spotReducer = (state = initialState, action) => {
    switch(action.type){
        case ALL_SPOTS:
            return {...state, ...action.spots}
        case DETAIL_SPOTS:
            return {...state, spotDetail: action.spots}
        case CREATE_SPOTS:
            return {...state, ...action.spots}
        case UPDATE_SPOTS:
            return {...state, ...action.spots}
        case DELETE_SPOTS:
            const newState = {...state}
            delete newState[action.spotId]
            return newState
    default:
        return state
    }
}

export default spotReducer
