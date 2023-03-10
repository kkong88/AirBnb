import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { getReviews, postReview, removeReview } from '../../store/review'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import DeleteReview from '../DeleteReview'


function UserReviews({spotId}){
    const dispatch = useDispatch()
    const reviews = useSelector((state) => state.review)
    const tempArr = Object.values(reviews)
    const reviewArr = tempArr.filter(review => review.spotId == spotId)

    useEffect(() => {
        dispatch(getReviews(spotId))
    }, [dispatch, spotId])

    // let reviewArr;
    let user

    // if(reviews) {
    //  reviewArr = Object.values(reviews.reviews)
    // }



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
        <i className="fa-regular fa-star"></i>
        {review.star}
        </div>
        <div className='time'>
            {review.createdAt && new Date(review.createdAt).toLocaleDateString('en-US',{month: 'long', year: 'numeric'})}
        </div>
        <button>
            <OpenModalMenuItem
            itemText='Delete'
            modalComponent={<DeleteReview spotId={spotId} reviewId={review.id}/>}
            />
        </button>
        </div>
       ))}
       </div>
       </div>
    )
}


export default UserReviews
