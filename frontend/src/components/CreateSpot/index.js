import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { createSpot } from '../../store/spot'




function CreateSpot() {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [address, setAddress] = useState('')
    const [description, setDesciption] = useState('')
    const [price, setPrice] = useState(1)
    const history = useHistory()

    const handleSubmit = (e) => {
        e.preventDefault()
        return dispatch(createSpot({name, state, country, city, address, description, price}))
    }

    return (
        <>
        <h1>Create a New Spot</h1>
        <h2>Where's your place located</h2>
        <form onSubmit={handleSubmit}>
        <li>
        <label>country
            <input
            type="text"
            value={country}
            onChange={(e)=> setCountry(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>street address
            <input
            type='text'
            value={address}
            onChange={(e) =>setAddress(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>city
            <input
            type='text'
            value={city}
            onChange={(e) =>setCity(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>state
            <input
            type='text'
            value={state}
            onChange={(e) =>setState(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>description
            <input
            type='text'
            value={description}
            onChange={(e) =>setDesciption(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>name
            <input
            type='text'
            value={name}
            onChange={(e) =>setName(e.target.value)}
            />
        </label>
        </li>
        <li>
        <label>price
            <input
            type='text'
            value={price}
            onChange={(e) =>setPrice(e.target.value)}
            />
        </label>
        </li>
        <button type="submit">Create</button>
        </form>
        </>
    )
}

export default CreateSpot
