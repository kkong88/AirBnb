import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getReviews, loadReviews, postReview } from "../../store/review";
import { useModal } from "../../context/Modal";
import './Review.css'

function CreateReview({spotId, userId}){
    const dispatch = useDispatch()
    const history = useHistory()
    const {closeModal} = useModal()
    const [review, setReview] = useState("")
    const [star, setStar] = useState(1)
    const [errors, setErrors] = useState([])


    // const handleReview = (e) => {
    //     const {name, value} = e.target
    //     switch(name){
    //         case "review":
    //             setReview(value)
    //             break;
    //         case 'star':
    //             setStar(value)
    //             break;
    //         default:
    //             return
    //     }
    // }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([])
        const validationError = []

        const payload = { review, star, spotId, userId }
        const newReview = await dispatch(postReview(payload))
        closeModal()
        await dispatch(getReviews(spotId))
        return newReview
    }

    return (
        <div className="review-container">
        <h1>Create a new review</h1>
        <textarea className="text-area" value={review} onChange={(e) => setReview(e.target.value)}></textarea>
            <div className="star-rating">
                <input type="radio" name="stars" id="star-a" value={5} onClick={(e) => setStar(e.target.value)} />
                <label htmlFor="star-a"></label>
                <input type="radio" name="stars" id="star-b" value={4} onClick={(e) => setStar(e.target.value)} />
                <label htmlFor="star-b"></label>
                <input type="radio" name="stars" id="star-c" value={3} onClick={(e) => setStar(e.target.value)} />
                <label htmlFor="star-c"></label>
                <input type="radio" name="stars" id="star-d" value={2} onClick={(e) => setStar(e.target.value)} />
                <label htmlFor="star-d"></label>
                <input type="radio" name="stars" id="star-e" value={1} onClick={(e) => setStar(e.target.value)} />
                <label htmlFor="star-e"></label>
            </div>
            <input type="number" placeholder="How Many Stars?" value={star} onChange={(e) => setStar(e.target.value)} min={1} max={5} />
            <button type='submit' onClick={handleSubmit} className='button-class'>Submit Your Review</button>
        </div>

)
}

export default CreateReview

{/* <form onSubmit={handleSubmit}>
    <label>
        <input
        type='text'
        value={review}
        onChange={(e) => setReview(e.target.value)}
        />
    </label>
    <label>
        <input
        type='number'
        min="1"
        max="5"
        value={star}
        onChange={(e) =>setStar(e.target.value)}
        />
    </label>
    <button type="submit">Submit review</button>
</form> */}
