import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useHistory, NavLink } from "react-router-dom"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import { getCurrentUserSpots, deleteSpot } from "../../store/spot"
import DeleteSpotModal from "../DeleteSpotModal"
import UpdateSpot from '../UpdateSpot'


function ManageSpot(){
    const dispatch = useDispatch()
    const history = useHistory()
    const spot = useSelector((state) => state.spot)
    const currentUser = useSelector((state) => state?.session?.user)

    const [userSpot, setUserSpot] = useState([])

    useEffect(() => {
        dispatch(getCurrentUserSpots())
    },[dispatch])

    useEffect(() => {
        const updatedSpot = spot?.Spot?.filter((ownSpot) => ownSpot?.ownerId === currentUser.id)
        setUserSpot(updatedSpot)
    },[spot, currentUser])

    const detail = spot?.spotDetail


    // const handleDelete = async (spotId) => {
    //    await dispatch(deleteSpot(spotId))
    //    await dispatch(getCurrentUserSpots())
    //     history.push(`/`)
    // }

    const handleDelete = async(spotId) => {
        await dispatch(deleteSpot(spotId)).then(async() => {
           await dispatch(getCurrentUserSpots());
        });
      };


    return (
        <div>
            <h2>Your Spots</h2>
        {userSpot?.map((spot)=>(
            <div key={spot.id}>
            <NavLink to={`/spots/${spot.id}`}>
                <img className="img" src={spot.previewImage} alt={spot.name} />
                <span className='state'> {spot.city}, {spot.state}</span>
                 <span> ${spot.price} </span>
                 <span className='review'> {spot.avgStarRating}
                  <i className='fa-solid fa-star'/>
                 </span>
            </NavLink>
            <button>
            <OpenModalMenuItem
            itemText='update'
            modalComponent={<UpdateSpot spot={detail} />}
            />
            </button>
            <button >
             <OpenModalMenuItem
             itemText='delete'
             modalComponent={<DeleteSpotModal
               spotId ={spot.id}
               handleDelete={handleDelete}
               />}
             />
              </button>
            </div>
        ))}
        </div>
    )
}

export default ManageSpot
