import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { deleteSpot, getDetail, updateSpot } from '../../store/spot'
import { useModal } from '../../context/Modal'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import UpdateSpot from '../UpdateSpot'
import UserReviews from '../UserReviews'
import CreateReview from '../CreateReview'

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

    // const openMenu = () => {
    //     if (showMenu) return;
    //     setShowMenu(true);
    //   };

    //   useEffect(() => {
    //     if (!showMenu) return;

    //     const closeMenu = (e) => {
    //       if (!ulRef.current.contains(e.target)) {
    //         setShowMenu(false);
    //       }
    //     };

    //     document.addEventListener('click', closeMenu);

    //     return () => document.removeEventListener("click", closeMenu);
    //   }, [showMenu]);

    // const closeMenu = () => setShowMenu(false);


    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     dispatch(getDetail(id))
    //     //history.push(`/spot/${id}/update`)
    // }

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
            //onButtonClick={closeMenu}
            modalComponent={<UpdateSpot spot={detail} />}
            />
        </button>
        <button onClick={handleDelete}>delete
        </button>
         <CreateReview />
         <OpenModalMenuItem
         itemText='Create a Review'
         modalComponent={<CreateReview spotId={id}/> }
         />
        <UserReviews spotId={id}/>
        </ul>
        </div>
    )
}

export default DetailSpot
