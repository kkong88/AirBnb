import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getReviews, postReview } from '../../store/review'


function UserReviews({spotId}){
    const dispatch = useDispatch()
    const reviews = useSelector((state) => state.review[spotId])
    const [Review, setReview] = useState('')
    const [star, setStar] = useState()
    const [errors, setErrors] = useState()

    console.log(spotId)
    useEffect(() => {
        dispatch(getReviews(spotId))
    }, [dispatch, spotId])

    let reviewArr;
    let user

    if(reviews) {
     reviewArr = Object.values(reviews.reviews)
     console.log(reviewArr)
    }




    return reviewArr && (
        <div>
            <h1>Reviews</h1>
        <div> {reviewArr?.map(review => (
        <div className='EachReview'>
        {review.review} {review.User.firstName} {review.User.lastName} *{review.star}
        </div>
       ))}
       </div>
       </div>
    )
}


export default UserReviews
