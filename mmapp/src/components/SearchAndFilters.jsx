import React, {useEffect, useState} from 'react';
import './SearchAndFilters.css';
import {supabase} from "./SupabaseClient.jsx";
import {useNavigate} from "react-router-dom";


const SearchAndFilters = ({handleVenueClick, deletePath}) => {
    let meeting = {};
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const [rests, setRest] = useState([]);
    const [result, setResult] = useState(null);

    const [cuisine, setCuisine] = useState('');
    const [price, setPrice] = useState('');
    const [atmosphere, setAtmosphere] = useState('');
    const [cuisine_id, setCuisineId] = useState(0);
    const [price_id, setPriceId] = useState(0);
    const [atmosphere_id, setAtmosphereId] = useState(0);
    const [NameOfMeeting, setCityName] = useState("");
    const [rangeValue, setRangeValue] = useState(1);

    const searchVenues = async (term) => {
        if (term.length > 0) {
            // Поиск по совпадению с названием
            let {data: venues, error} = await supabase
                .from("Venue")
                .select("Name, location")
                .ilike("Name", `%${term}%`);

            if (error) {
                console.error("Ошибка при поиске мест:", error);
            } else {
                setSearchResults(venues);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleInputChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        searchVenues(term);
    };

    const toggleSearch = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionChange1 = (e) => {
        meeting["cuisine"] = e.target.value;
        setCuisine(e.target.value);
        setCuisineId(e.target.selectedIndex);
    };

    const handleOptionChange2 = (e) => {
        meeting["price"] = e.target.value;
        setPrice(e.target.value);
        setPriceId(e.target.selectedIndex);
    };

    const handleOptionChange3 = (e) => {
        meeting["atmosphere"] = e.target.value;
        setAtmosphere(e.target.value);
        setAtmosphereId(e.target.selectedIndex);
    };

    const handleRangeChange = (e) => {
        meeting["people"] = e.target.value;
        setRangeValue(e.target.value);
    };

    const analyze = () => {
        const WEIGHTS = {
            cuisine: 4,
            price: 3,
            atmosphere: 3
        };

        return rests.map(rest => {
            let score = 0;

            if (rest.cuisine_id === cuisine_id) {
                score += WEIGHTS.cuisine;
            }

            if (rest.price_id === price_id) {
                score += WEIGHTS.price;
            }

            if (rest.atmosphere_id === atmosphere_id) {
                score += WEIGHTS.atmosphere;
            }

            return { ...rest, score };
        }).sort((a, b) => b.score - a.score)
            .find(rest => rest.score > 0) || null;
    }


    const handleCreate = async () => {
        let { data:Venue, error } = await supabase
            .from('Venue')
            .select('Name, cuisine_id, price_id, atmosphere_id');

        if (error) {
            console.error('Error of reading data', error);
        }
        else {
            setRest(Venue);
            const result = analyze();

            if(result !== null){
                console.log(result.Name);
                await writeMeeting(result.Name)
            }
        }
    };

    const writeMeeting = async (res_name) => {
        let meetingDate = '06.10.2024'
        let participantMinNumber = rangeValue;
        let venueName = res_name;
        let meetingName = NameOfMeeting
        const { data, error } = await supabase
            .from('Meetings')
            .insert([{meetingDate, meetingName, venueName, participantMinNumber}]);

        if (error) {
            console.error('Ошибка при сохранении встречи:', error);
        } else {
            console.log("yes")
            navigate('/meeting');
        }
    }

    return (
            <div className="search-filters-container">
                <div className="search">
                    <div className="search-container">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            placeholder="Search for places..."
                            className="search-input"
                        />
                    </div>
                    <div className="search-results">
                        {searchResults.map((venue) => (
                            <div key={venue.id} className="search-result-item"
                                 onClick={() => handleVenueClick(venue.location)}>
                                {venue.Name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="meetings">
                    <div className="some-buttons">
                        <button onClick={toggleSearch} className="toggle-button">
                            {isOpen ? 'Close' : 'Create meeting!'}
                        </button>
                        <button onClick={deletePath} className="del-button">
                            Delete path
                        </button>
                    </div>

                    {isOpen && (
                        <div className="meeting-settings">
                            <h3>Create meeting!</h3>
                            <div className="input-container">
                                <label htmlFor="city-input">Name your meeting:</label>
                                <input
                                    type="text"
                                    id="city-input"
                                    value={NameOfMeeting}
                                    onChange={(e) => setCityName(e.target.value)}
                                    placeholder="Meeting name"
                                    className="city-input"
                                />
                            </div>
                            <div className="dropdown-container">
                                <label htmlFor="dropdown1">Сuisine:</label>
                                <select id="dropdown1" value={cuisine} onChange={handleOptionChange1}>
                                    <option value="">Select one</option>
                                    <option value="option1">Nordic</option>
                                    <option value="option2">Asian</option>
                                    <option value="option3">Italian</option>
                                    <option value="option4">Greek</option>
                                </select>
                            </div>

                            <div className="dropdown-container">
                                <label htmlFor="dropdown2">Price:</label>
                                <select id="dropdown2" value={price} onChange={handleOptionChange2}>
                                    <option value="">Select one</option>
                                    <option value="option1">€</option>
                                    <option value="option2">€€</option>
                                    <option value="option3">€€€</option>
                                </select>
                            </div>

                            <div className="dropdown-container">
                                <label htmlFor="dropdown3">Atmosphere:</label>
                                <select id="dropdown3" value={atmosphere} onChange={handleOptionChange3}>
                                    <option value="">Select one</option>
                                    <option value="option1">Casual</option>
                                    <option value="option2">Fast-Food</option>
                                    <option value="option3">Fine-Dining</option>
                                    <option value="option4">Cafe</option>
                                </select>
                            </div>
                            <div className="range-slider-container">
                                <label htmlFor="range-slider">Number of people: {rangeValue}</label>
                                <input
                                    type="range"
                                    id="range-slider"
                                    min="1"
                                    max="10"
                                    value={rangeValue}
                                    onChange={handleRangeChange}
                                    className="range-slider"
                                />
                            </div>
                            <button onClick={handleCreate} className="save-button">
                                CREATE
                            </button>
                        </div>
                    )}
                </div>
            </div>
    );
};

export default SearchAndFilters;