
import React, { useEffect, useState } from 'react';
import './InstantConsultation.css';
import { useSearchParams } from 'react-router-dom';
import FindDoctorSearchIC from './FindDoctorSearchIC/FindDoctorSearchIC';
import DoctorCardIC from './DoctorCardIC/DoctorCardIC';

const InstantConsultation = () => {
    const [searchParams] = useSearchParams();

    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [isSearched, setIsSearched] = useState(false);

    const getDoctorsDetails = () => {
        fetch('https://api.npoint.io/9a5543d36f1460da2f63')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Unable to fetch doctor details');
                }
                return res.json();
            })
            .then(data => {

                // Assign sample profile images to doctors
                const doctorsWithImages = data.map((doctor, index) => ({
                    ...doctor,
                    profilePic: `https://i.pravatar.cc/150?img=${index + 12}`
                }));

                setDoctors(doctorsWithImages);

                const speciality = searchParams.get('speciality');

                if (speciality) {
                    const filtered = doctorsWithImages.filter(
                        doctor =>
                            doctor.speciality.toLowerCase() ===
                            speciality.toLowerCase()
                    );

                    setFilteredDoctors(filtered);
                    setIsSearched(true);
                } else {
                    setFilteredDoctors([]);
                    setIsSearched(false);
                }
            })
            .catch(err => console.error('Doctor API Error:', err));
    };

    const handleSearch = (searchText) => {
        if (searchText.trim() === '') {
            setFilteredDoctors([]);
            setIsSearched(false);
            return;
        }

        const filtered = doctors.filter(
            doctor =>
                doctor.speciality.toLowerCase().includes(
                    searchText.trim().toLowerCase()
                )
        );

        setFilteredDoctors(filtered);
        setIsSearched(true);
    };

    useEffect(() => {
        getDoctorsDetails();
    }, [searchParams]);

    return (
        <div className="searchpage-container">

            <FindDoctorSearchIC onSearch={handleSearch} />

            <div className="search-results-container">

                {isSearched && (
                    <div>
                        <h2>
                            {filteredDoctors.length} doctors are available
                            {' '}{searchParams.get('location')}
                        </h2>

                        <h3>
                            Book appointments with minimum wait-time &
                            verified doctor details
                        </h3>

                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map(doctor => (
                                <DoctorCardIC
                                    {...doctor}
                                    key={doctor.name}
                                />
                            ))
                        ) : (
                            <p>No doctors found.</p>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default InstantConsultation;
