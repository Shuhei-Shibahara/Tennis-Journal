import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { LoadScript, GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { useJournal } from '../hooks/useJournal';
import JournalFormFields from './shared/JournalFormFields';
import Button from './shared/Button';
import { MAP_DEFAULT_CENTER, MAP_CONTAINER_STYLE } from '../constants';
import { JournalEntry } from '../types';
import * as d3 from 'd3';

const JournalEntryForm: React.FC = () => {
  const navigate = useNavigate();
  const { createEntry } = useJournal();
  const user = useSelector((state: RootState) => state.session.user);
  const [location, setLocation] = useState(MAP_DEFAULT_CENTER);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [statsUrl, setStatsUrl] = useState('');
  const [stats, setStats] = useState<any[]>([]);
  const [selectedStat, setSelectedStat] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<JournalEntry>();

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry) {
      const lat = place.geometry.location?.lat() ?? MAP_DEFAULT_CENTER.lat;
      const lng = place.geometry.location?.lng() ?? MAP_DEFAULT_CENTER.lng;
      setLocation({ lat, lng });
      setValue('location', place.formatted_address || '');
    }
  };

  const handleStatsFetch = async (url: string) => {
    try {
      const response = await fetch(`http://localhost:5050/api/scrape?url=${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const onSubmit = async (data: JournalEntry) => {
    setIsSubmitting(true);
    try {
      if (!user?.userId) {
        throw new Error('User ID is missing');
      }

      await createEntry({
        ...data,
        userId: user.userId,
        stats: JSON.stringify(stats),
      });

      setSuccessMessage('Journal entry created successfully!');
      reset();
      setTimeout(() => {
        navigate('/journal-entries');
      }, 2000);
    } catch (error) {
      console.error('Error creating journal entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!selectedStat || !stats.length) return;

    const selectedData = stats.find((stat) => stat.stat === selectedStat);
    if (!selectedData) return;

    d3.select('#chart').selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select('#chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(['Player A', 'Player B'])
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, Math.max(selectedData.playerA, selectedData.playerB)])
      .nice()
      .range([height, 0]);

    svg.selectAll('.bar')
      .data([
        { player: 'Player A', value: selectedData.playerA },
        { player: 'Player B', value: selectedData.playerB }
      ])
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.player)!)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', (d, i) => i === 0 ? '#60A5FA' : '#F87171');

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.selectAll('.label')
      .data([
        { player: 'Player A', value: selectedData.playerA },
        { player: 'Player B', value: selectedData.playerB }
      ])
      .join('text')
      .attr('class', 'label')
      .attr('x', d => x(d.player)! + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.value);

  }, [selectedStat, stats]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
      libraries={["places"]}
    >
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Create New Journal Entry
          </h2>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Match Details
                </h3>
                <JournalFormFields
                  register={register}
                  errors={errors}
                  mode="create"
                />
              </div>

              {/* Location and Stats Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Location & Statistics
                </h3>

                {/* Location Search */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Search Location
                  </label>
                  <StandaloneSearchBox
                    onLoad={setSearchBox}
                    onPlacesChanged={() => {
                      const places = searchBox?.getPlaces();
                      if (places && places.length > 0) {
                        handlePlaceSelect(places[0]);
                      }
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search for a location"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </StandaloneSearchBox>
                </div>

                {/* Map */}
                <div className="mb-6 rounded-lg overflow-hidden border border-gray-300">
                  <GoogleMap
                    mapContainerStyle={MAP_CONTAINER_STYLE}
                    center={location}
                    zoom={13}
                  >
                    <Marker position={location} />
                  </GoogleMap>
                </div>

                {/* Stats URL Input */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Match Statistics URL
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={statsUrl}
                      onChange={(e) => setStatsUrl(e.target.value)}
                      placeholder="Enter URL for match statistics"
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleStatsFetch(statsUrl)}
                    >
                      Fetch Stats
                    </Button>
                  </div>
                </div>

                {/* Stats Display */}
                {stats.length > 0 && (
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-4">Match Statistics</h4>
                      
                      {/* Stats Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statistic
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Player A
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Player B
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {stats.map((stat, index) => (
                              <tr 
                                key={index}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => setSelectedStat(stat.stat)}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {stat.stat}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                  {stat.playerA}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                  {stat.playerB}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* D3 Visualization */}
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-700 mb-2">
                          {selectedStat ? `Visualization: ${selectedStat}` : 'Select a statistic to visualize'}
                        </h4>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <svg id="chart" className="w-full"></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </LoadScript>
  );
};

export default JournalEntryForm;
