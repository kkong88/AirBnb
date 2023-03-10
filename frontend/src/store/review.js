import { csrfFetch } from "./csrf"

const GET_REVIEWS = 'reviews/GET_REVIEWS'
const POST_REVIEW = 'reviews/POST_REVIEW'
const DELETE = 'reviews/DELETE'



export const createReview = (reviews) => {
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

export const deleteReview = (reviewId) => {
    return {
    type: DELETE,
    reviewId
    }
}

export const postReview = (reviewData) => async dispatch => {
    let {review, star, spotId} = reviewData
    // spotId = parseInt(spotId)
    star = parseInt(star)

    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify({review, star})
    })
    if(response.ok){
        const newReview = await response.json()
        dispatch(createReview(newReview))
        return newReview
    }
}

export const removeReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    })
    if(response){
        const data = await response.json()
        dispatch(deleteReview(data))
        return data
    }
}

export const getReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    if(response.ok){
        const data = await response.json()
        dispatch(loadReviews(data))
        return data
    }
}

const initialState = {}

const reviewReducer = (state = initialState, action) => {
    let newState = {}
    switch(action.type){
        case POST_REVIEW:
            return {...state, ...action.reviews}
        case GET_REVIEWS:
            newState = { ...state }
            if(action.reviews.reviews.length){
            newState[action.reviews.reviews[0].spotId] = action.reviews
            return {...newState}
            } else {
                return {...newState}
            }
        case DELETE:
            newState = {...state}
            delete newState[action.reviewId]
            return newState
        default:
            return state
    }

}

export default reviewReducer
