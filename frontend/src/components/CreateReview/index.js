import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { postReview } from "../../store/review";
import { useModal } from "../../context/Modal";

function CreateReview({spotId, userId}){
    const dispatch = useDispatch()
    const history = useHistory
    const {closeModal} = useModal()
    const [review, setReview] = useState("")
    const [star, setStar] = useState(Number)
    const [errors, setErrors] = useState([])


    const handleReview = (e) => {
        const {name, value} = e.target
        switch(name){
            case "review":
                setReview(value)
                break;
            case 'star':
                setStar(value)
                break;
            default:
                return
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([])
        const validationError = []

        const payload = { review, star, spotId, userId }
        const newReview = await dispatch(postReview(payload))
        closeModal()
        return newReview
    }

    return (
        <>
        <h1>Create a new review</h1>
        <form onSubmit={handleSubmit}>
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
                value={star}
                onChange={(e) =>setStar(e.target.value)}
                />
            </label>
            <button type="submit">Submit review</button>
        </form>
        </>
    )
}

export default CreateReview
