import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { LoadScript, GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';

interface IJournalEntry {
  date: string;
  opponent: string;
  tournamentName: string;
  location: string;
  courtSurface: string;
  strengths: string;
  weaknesses: string;
  lessonsLearned: string;
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

const mapCenter = {
  lat: 34.0522,  // Default latitude (e.g., Los Angeles)
  lng: -118.2437,  // Default longitude (e.g., Los Angeles)
};

const JournalEntryForm: React.FC = () => {
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<IJournalEntry>();
  const user = useSelector((state: RootState) => state.session.user);
  const [location, setLocation] = React.useState(mapCenter); // Map location state
  const [searchBox, setSearchBox] = React.useState<google.maps.places.SearchBox | null>(null); // State for search box

  const onSubmit: SubmitHandler<IJournalEntry> = async (data) => {
    try {
      const userId = user?._id;

      if (!userId) {
        alert('User ID is missing. Please log in again.');
        return;
      }

      await axios.post('http://localhost:5000/api/journals', { ...data, userId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      alert('Journal entry submitted successfully!');
      reset();
    } catch (error) {
      console.error('Error submitting journal entry:', error);
      alert('Failed to submit journal entry. Please try again.');
    }
  };

  // Function to handle place selection from search box
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry) {
      const lat = place.geometry.location?.lat() ?? 34.0522; // Default latitude
      const lng = place.geometry.location?.lng() ?? -118.2437; // Default longitude
      setLocation({ lat, lng }); // Set map location
      setValue('location', place.formatted_address || ''); // Set the value of the location field
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
      libraries={["places"]}
    >
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Journal Entry</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1" htmlFor="date">Date</label>
            <input
              type="date"
              {...register('date', { required: true })}
              className={`w-full p-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.date && <span className="text-red-500 text-sm">This field is required</span>}
          </div>

          <div>
            <label className="block mb-1" htmlFor="opponent">Opponent</label>
            <input
              type="text"
              {...register('opponent', { required: true })}
              placeholder="Opponent"
              className={`w-full p-2 border ${errors.opponent ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.opponent && <span className="text-red-500 text-sm">This field is required</span>}
          </div>

          <div>
            <label className="block mb-1" htmlFor="tournamentName">Tournament Name</label>
            <input
              type="text"
              {...register('tournamentName', { required: true })}
              placeholder="Tournament Name"
              className={`w-full p-2 border ${errors.tournamentName ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.tournamentName && <span className="text-red-500 text-sm">This field is required</span>}
          </div>

          <div>
            <label className="block mb-1" htmlFor="location">Location</label>
            <StandaloneSearchBox
              onLoad={(ref) => setSearchBox(ref)}
              onPlacesChanged={() => {
                const places = searchBox?.getPlaces();
                if (places && places.length > 0) {
                  handlePlaceSelect(places[0]);
                }
              }}
            >
              <input
                type="text"
                {...register('location', { required: true })}
                placeholder="Location"
                className={`w-full p-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
            </StandaloneSearchBox>
            {errors.location && <span className="text-red-500 text-sm">This field is required</span>}
          </div>

          {/* Google Maps Integration */}
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={10}
          >
            <Marker position={location} />
          </GoogleMap>

          <div>
            <label className="block mb-1" htmlFor="courtSurface">Court Surface</label>
            <input
              type="text"
              {...register('courtSurface', { required: true })}
              placeholder="Court Surface"
              className={`w-full p-2 border ${errors.courtSurface ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.courtSurface && <span className="text-red-500 text-sm">This field is required</span>}
          </div>

          <div>
            <label className="block mb-1" htmlFor="strengths">Strengths</label>
            <textarea
              {...register('strengths', { required: true })}
              placeholder="Strengths"
              className={`w-full p-2 border ${errors.strengths ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.strengths && <span className="text-red-500 text-sm">This field is required</span>}
          </div>

          <div>
            <label className="block mb-1" htmlFor="weaknesses">Weaknesses</label>
            <textarea
              {...register('weaknesses', { required: true })}
              placeholder="Weaknesses"
              className={`w-full p-2 border ${errors.weaknesses ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.weaknesses && <span className="text-red-500 text-sm">This field is required</span>}
          </div>

          <div>
            <label className="block mb-1" htmlFor="lessonsLearned">What I Learned</label>
            <textarea
              {...register('lessonsLearned', { required: true })}
              placeholder="What I Learned"
              className={`w-full p-2 border ${errors.lessonsLearned ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.lessonsLearned && <span className="text-red-500 text-sm">This field is required</span>}
          </div>

          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Submit
          </button>
        </form>
      </div>
    </LoadScript>
  );
};

export default JournalEntryForm;
