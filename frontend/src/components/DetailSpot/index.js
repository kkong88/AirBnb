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
    const { closeModal } = useModal()
    const [showMenu, setShowMenu] = useState(false)
    const ulRef = useRef();



    const handleDelete = (e) => {
        e.preventDefault()
        dispatch(deleteSpot(id))
        history.push(`/`)
    }


    useEffect(() => {
        dispatch(getDetail(id))
    },[dispatch, id])

    const detail = spots?.spotDetail

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
        <button>
            <OpenModalMenuItem
            itemText='update'
            modalComponent={<UpdateSpot spot={detail} />}
            />
        </button>
        <button onClick={handleDelete}>delete
        </button>
        <p>
         <OpenModalMenuItem
         itemText='Create a Review'
         modalComponent={<CreateReview spotId={id}/> }
         />
        </p>
        <UserReviews spotId={id}/>
        {/* {review.reviews?.map(currentReview =>(
        <button>
            <OpenModalMenuItem
            itemText='Delete'
            modalComponent={<DeleteReview spotId={id} reviewId={currentReview.id}/>}
            />
        </button>
         ))} */}
        </ul>
        </div>
    )
}

export default DetailSpot
