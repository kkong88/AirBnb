import { csrfFetch } from "./csrf"

const ALL_SPOTS = 'spots/ALL_SPOTS'
const DETAIL_SPOTS = 'spots/DETAIL_SPOTS'
const CREATE_SPOTS = 'spots/CREATE_SPOTS'

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
    console.log(response)
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
            console.log(imageRes)
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
        case CREATE_SPOTS:
            return {...state, ...action.spots}
    default:
        return state
    }
}

export default spotReducer
