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
        <div>{images?.map(image => (
            <img src={image.url}></img>
        ))}
        <ul>
        <li>{detail.Owner.firstName}, {detail.Owner.lastName}</li>
        <li>{detail.state}</li>
        <li>{detail.city}</li>
        <li>{detail.country}</li>
        <li>{detail.name}</li>
        <li>{detail.price}</li>
        <li>{detail.description}</li>
        <li>{detail.avgStarRating}</li>
        {(!currentUser === spotOwner || spotOwner) || (
        <button>
            <OpenModalMenuItem
            itemText='update'
            modalComponent={<UpdateSpot spot={detail} />}
            />
        </button>
        )}
         {(!currentUser === spotOwner || spotOwner) || (
        <button onClick={handleDelete}>delete
        </button>
         )}
        {(!currentUser === !spotOwner || spotOwner) || (
        <p>
        <button>
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
