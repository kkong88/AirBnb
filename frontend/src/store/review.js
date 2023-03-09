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

export const postReview = (reviewData) => async dispatch => {
    let {review, star, spotId} = reviewData
    spotId = parseInt(spotId)
    star = parseInt(star)

    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify({review, star})
    })
    console.log(response)
    if(response.ok){
        const newReview = await response.json()
        dispatch(createReview(newReview))
        console.log(newReview)
        return newReview
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
            return {...state, ...action.reviews}
        case GET_REVIEWS:
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
