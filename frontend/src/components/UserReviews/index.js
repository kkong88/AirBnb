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
        <div className='reviews'>
        {review.review}
        </div>
        <div className='user'>
        {review.User.firstName}, {review.User.lastName}
        </div>
        <div className='rating'>
        *{review.star}
        </div>
        <div className='time'>
            {review.createdAt && new Date(review.createdAt).toLocaleDateString('en-US',{month: 'long', year: 'numeric'})}
        </div>
        </div>
       ))}
       </div>
       </div>
    )
}


export default UserReviews
