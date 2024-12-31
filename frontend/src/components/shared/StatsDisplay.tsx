import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface StatsDisplayProps {
  stats: any[];
  result: 'Win' | 'Lose';
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, result }) => {
  const [selectedStat, setSelectedStat] = useState<string>('');
  const chartId = useRef(`chart-${Math.random().toString(36).substr(2, 9)}`);

  const getPlayerLabels = () => ({
    playerA: result === 'Win' ? 'You (Winner)' : 'You (Loser)',
    playerB: result === 'Win' ? 'Opponent (Loser)' : 'Opponent (Winner)'
  });

  useEffect(() => {
    // Clear previous chart
    d3.select(`#${chartId.current}`).selectAll('*').remove();

    if (!selectedStat || !stats.length) return;

    const selectedData = stats.find((stat) => stat.stat === selectedStat);
    if (!selectedData) return;

    const playerLabels = getPlayerLabels();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(`#${chartId.current}`)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain([playerLabels.playerA, playerLabels.playerB])
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, Math.max(selectedData.playerA, selectedData.playerB)])
      .nice()
      .range([height, 0]);

    // Add bars
    svg.selectAll('.bar')
      .data([
        { player: playerLabels.playerA, value: selectedData.playerA },
        { player: playerLabels.playerB, value: selectedData.playerB }
      ])
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.player)!)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', (d, i) => i === 0 ? '#60A5FA' : '#F87171')
      .attr('rx', 4)
      .attr('ry', 4);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-15)')
      .style('text-anchor', 'end');

    svg.append('g')
      .call(d3.axisLeft(y));

    // Add value labels
    svg.selectAll('.label')
      .data([
        { player: playerLabels.playerA, value: selectedData.playerA },
        { player: playerLabels.playerB, value: selectedData.playerB }
      ])
      .join('text')
      .attr('class', 'label')
      .attr('x', d => x(d.player)! + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.value)
      .style('fill', '#4B5563')
      .style('font-size', '12px');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text(selectedStat);

  }, [selectedStat, stats, result]);

  const playerLabels = getPlayerLabels();

  return (
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
                  {playerLabels.playerA}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {playerLabels.playerB}
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
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right 
                    ${result === 'Win' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}`}>
                    {stat.playerA}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right 
                    ${result === 'Win' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}`}>
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
            <svg id={chartId.current} className="w-full"></svg>
            <div className="flex justify-center mt-2 space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 mr-1"></div>
                <span>{playerLabels.playerA}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 mr-1"></div>
                <span>{playerLabels.playerB}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay; 