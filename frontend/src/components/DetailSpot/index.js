import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { deleteSpot, getDetail, updateSpot } from '../../store/spot'
import { useModal } from '../../context/Modal'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import UpdateSpot from '../UpdateSpot'
import UserReviews from '../UserReviews'
import CreateReview from '../CreateReview'
import DeleteReview from '../DeleteReview'
import "./DetailSpot.css"

function DetailSpot(){
    const history = useHistory()
    const dispatch = useDispatch()
    const { id } = useParams()
    const spots = useSelector((state) => state?.spot)
    const currentUser = useSelector((state) => state.session.user)

    const detail = spots?.spotDetail

    const spotOwner = currentUser && spots && currentUser?.id === detail?.ownerId



    const handleDelete = (e) => {
        e.preventDefault()
        dispatch(deleteSpot(id))
        history.push(`/`)
    }


    useEffect(() => {
        dispatch(getDetail(id))
    },[dispatch, id])


    if(detail === undefined) return <div>loading</div>
    const images = spots?.spotDetail.SpotImages

    return (
        <div className='body-container'>
        <div className='image-container'>
            {images?.map(image => (
            <img src={image.url} className='images'></img>
        ))}
        </div>
        <ul className='detail'>
        <h2 className=''>{detail.name}</h2>
        <h1 className='host'>Hosted By: {detail.Owner.firstName}, {detail.Owner.lastName}</h1>
        <div className='location'> {detail.city}, {detail.state}, {detail.country} </div>
        <div>{detail.address}</div>
        <div>${detail.price} /night</div>
        <div>{detail.description}</div>
        <div>{detail.avgStarRating} <i className="fa-sharp fa-solid fa-star"></i></div>
        {(!currentUser === spotOwner || !spotOwner) || (
        <button className='button-update-delete'>
            <OpenModalMenuItem
            itemText='update'
            modalComponent={<UpdateSpot spot={detail} />}
            />
        </button>
        )}
         {(!currentUser === spotOwner || !spotOwner) || (
        <button onClick={handleDelete} className='button-update-delete'>delete
        </button>
         )}
        {(!currentUser === !spotOwner || spotOwner) || (
        <p>
        <button className='review-button'>
         <OpenModalMenuItem
         itemText='Create a Review'
         modalComponent={<CreateReview spotId={id}/> }
         />
        </button>
        </p>
        )}
        <UserReviews spotId={id}/>
        </ul>
        </div>
    )
}

export default DetailSpot
