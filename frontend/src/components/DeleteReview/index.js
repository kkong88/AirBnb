import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getReviews, removeReview } from "../../store/review";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { useModal } from '../../context/Modal'
import { useState } from "react";
import { getDetail, getSpot } from "../../store/spot";



function DeleteReview({reviewId, spotId}){

    const dispatch = useDispatch()
    const history = useHistory()
    const {closeModal} = useModal()
    const currentUser = useSelector((state) => state.session.user)
    const currentReview = useSelector((state) => state?.review)
    const currentUserReview = currentReview?.reviews?.find((review) => review.user.id === currentUser.id && review.id === reviewId)

    const handleDelete = async() => {
        await dispatch(removeReview(reviewId))
        await dispatch(getReviews(spotId))
        await dispatch(getDetail(spotId))
        closeModal()
    }

    const handleCancel = () => {
        closeModal()
    }
    return (
        <>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleCancel}>Cancel</button>
        </>
    )

}


export default DeleteReview
