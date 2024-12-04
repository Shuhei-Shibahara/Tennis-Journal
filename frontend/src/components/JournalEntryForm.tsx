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
  strengths: string[];
  weaknesses: string[];
  lessonsLearned: string;
  result?: 'Win' | 'Lose'; // Result toggle
  score?: string; // Score input
  stats?: string; // Stats input box (optional)
}


const containerStyle = {
  width: '100%',
  height: '400px',
};

const mapCenter = {
  lat: 34.0522,
  lng: -118.2437,
};

const JournalEntryForm: React.FC = () => {
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<IJournalEntry>();
  const user = useSelector((state: RootState) => state.session.user);
  const [location, setLocation] = React.useState(mapCenter);
  const [reviews, setReviews] = React.useState<string[]>([]);
  const [searchBox, setSearchBox] = React.useState<google.maps.places.SearchBox | null>(null);
  const [statsUrl, setStatsUrl] = React.useState<string>(''); // URL state


  const onSubmit: SubmitHandler<IJournalEntry> = async (data) => {
    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      const userId = user?.userId;

      if (!userId) {
        alert('User ID is missing. Please log in again.');
        return;
      }

      await axios.post(`${apiUrl}/api/journals`, { ...data, userId }, {
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


  const handleStatsFetch = async (url: string): Promise<void> => {
    if (!url) {
      console.error("URL is required to fetch stats.");
      return;
    }

    try {
      // Request to the scraper backend route
      const response = await axios.get('http://localhost:5050/api/scrape', {
        params: { url }, // Send the URL as a query parameter
      });

      const { stats } = response.data;

      // Process the stats data as needed
      console.log("Fetched stats:", stats);

      // Update your state or UI with the fetched stats
      // Example: setStats(stats); if using React state
    } catch (error) {
      // Type guard to check if error is an AxiosError
      if (axios.isAxiosError(error)) {
        console.error("Axios error message:", error.message);
      } else {
        console.error("Unknown error occurred:", error);
      }
    }
  };


  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry) {
      const lat = place.geometry.location?.lat() ?? mapCenter.lat;
      const lng = place.geometry.location?.lng() ?? mapCenter.lng;

      setLocation({ lat, lng });
      setValue('location', place.formatted_address || '');

      // Extract reviews if available
      const placeReviews = place.reviews?.map((review) => review.text) || [];
      setReviews(placeReviews);
    }
  };
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
      libraries={["places"]}
    >
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Journal Entry</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="date" className="block font-medium">Date</label>
            <input
              type="date"
              {...register('date', { required: true })}
              className={`w-full p-3 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.date && <p className="text-red-500 text-sm">Date is required.</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="result" className="block font-medium">Result</label>
            {['Win', 'Lose'].map((result) => (
              <label key={result} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={result}
                  {...register('result')}
                  className="form-radio"
                />
                <span>{result}</span>
              </label>
            ))}
          </div>

          {/* New Score Input */}
          <div className="space-y-2">
            <label htmlFor="score" className="block font-medium">Score</label>
            <input
              type="text"
              {...register('score')}
              placeholder="Enter match score (e.g., 6-4, 7-5)"
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>

          {/* New Stats Input */}
          {/* <div className="space-y-2">
            <label htmlFor="stats" className="block font-medium">Stats</label>
            <textarea
              {...register('stats')}
              placeholder="Optional: Enter match statistics (e.g., Aces: 10, Double Faults: 2)"
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div> */}

          <div className="space-y-2">
            <label htmlFor="opponent" className="block font-medium">Opponent</label>
            <input
              type="text"
              {...register('opponent', { required: true })}
              placeholder="Opponent Name"
              className={`w-full p-3 border ${errors.opponent ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.opponent && <p className="text-red-500 text-sm">Opponent is required.</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="tournamentName" className="block font-medium">Tournament Name</label>
            <input
              type="text"
              {...register('tournamentName', { required: true })}
              placeholder="Tournament Name"
              className={`w-full p-3 border ${errors.tournamentName ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.tournamentName && <p className="text-red-500 text-sm">Tournament Name is required.</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="courtSurface" className="block font-medium">Court Surface</label>
            {['Hard', 'Clay', 'Grass'].map((surface) => (
              <label key={surface} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={surface}
                  {...register('courtSurface', { required: true })}
                  className="form-radio"
                />
                <span>{surface}</span>
              </label>
            ))}
            {errors.courtSurface && <p className="text-red-500 text-sm">Court Surface is required.</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="strengths" className="block font-medium">Strengths</label>
            {['Forehand', 'Backhand', 'Serve', 'Volley', 'Return'].map((strength) => (
              <label key={strength} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={strength}
                  {...register('strengths')}
                  className="form-checkbox"
                />
                <span>{strength}</span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="weaknesses" className="block font-medium">Weaknesses</label>
            {['Forehand', 'Backhand', 'Serve', 'Volley', 'Return'].map((weakness) => (
              <label key={weakness} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={weakness}
                  {...register('weaknesses')}
                  className="form-checkbox"
                />
                <span>{weakness}</span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="lessonsLearned" className="block font-medium">Lessons Learned</label>
            <textarea
              {...register('lessonsLearned', { required: true })}
              placeholder="Share your experience"
              className={`w-full p-3 border ${errors.lessonsLearned ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.lessonsLearned && <p className="text-red-500 text-sm">Lessons Learned is required.</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="statsUrl" className="block font-medium">Match Stats URL</label>
            <input
              type="text"
              value={statsUrl}
              onChange={(e) => setStatsUrl(e.target.value)}
              placeholder="Enter URL for match stats"
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>

          <button
            type="button"
            onClick={() => handleStatsFetch(statsUrl)} // Pass the current statsUrl state
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Fetch Stats
          </button>

          {/* Stats input */}
          <div className="space-y-2">
            <label htmlFor="stats" className="block font-medium">Stats</label>
            <textarea
              {...register('stats')}
              placeholder="Optional: Enter match statistics (e.g., Aces: 10, Double Faults: 2)"
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>


          <div className="space-y-2">
            <label htmlFor="location" className="block font-medium">Location</label>
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
                placeholder="Enter location"
                className={`w-full p-3 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
            </StandaloneSearchBox>
            {errors.location && <p className="text-red-500 text-sm">Location is required.</p>}
          </div>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={12}
          >
            <Marker position={location} />
          </GoogleMap>

          {reviews.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold text-lg">Reviews</h3>
              <ul className="list-disc ml-6">
                {reviews.map((review, index) => (
                  <li key={index} className="text-gray-700">{review}</li>
                ))}
              </ul>
            </div>
          )}

          <button type="submit" className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
            Submit
          </button>
        </form>
      </div>
    </LoadScript>
  );
};

export default JournalEntryForm;
