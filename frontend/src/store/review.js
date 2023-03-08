import { csrfFetch } from "./csrf"

const GET_REVIEWS = 'reviews/GET_REVIEWS'
const POST_REVIEW = 'reviews/POST_REVIEW'


export const createReview = (reviews) => {
    console.log(reviews)
    return {
        type: POST_REVIEW,
        reviews
    }
}

export const loadReviews = (reviews) => {
    return {
        type: GET_REVIEWS,
        reviews
    }
}

export const postReview = (spotId,reviews) => async dispatch => {

    const response = await csrfFetch(`api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify(reviews)
    })
    if(response.ok){
        const review = await response.json()
        dispatch(createReview())
        return review
    }
}

export const getReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    if(response.ok){
        const data = await response.json()
        dispatch(loadReviews(data))
        return response
    }
}

const initialState = {}

const reviewReducer = (state = initialState, action) => {
    switch(action.type){
        case POST_REVIEW:
            return {...state, ...action.spotId}
        case GET_REVIEWS:
            console.log(action.reviews.reviews,"!!!!!!")
            const newState = { ...state }
            if(action.reviews.reviews.length){
            newState[action.reviews.reviews[0].spotId] = action.reviews
            }
            return { ...newState }
        default:
            return state
    }

}

export default reviewReducer
