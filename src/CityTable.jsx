import React, { useState, useEffect } from 'react';
import { FaSortUp, FaSortDown, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CityTable = () => {
    const [cityData, setCityData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const navigateTo = useNavigate();

    useEffect(() => {
        fetchCityData();
    }, []);

    const fetchCityData = async () => {
        try {
            const response = await fetch(
                `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=10000`
            );
            const data = await response.json();

            if (!response.ok) {
                setError('Failed to fetch city data');
                return;
            }

            setCityData(data.records);
            setLoading(false);
        } catch (error) {
            setError('Error fetching city data: ' + error.message);
        }
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    const toggleFavorite = (cityId) => {
        const isFavorite = favorites.includes(cityId);
        if (isFavorite) {
            setFavorites(favorites.filter((id) => id !== cityId));
        } else {
            setFavorites([...favorites, cityId]);
        }
    };

    const sortedCityData = [...cityData].sort((a, b) => {
        if (sortBy) {
            const valueA = a.fields[sortBy]?.toLowerCase();
            const valueB = b.fields[sortBy]?.toLowerCase();
            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        }
        return 0;
    });

    const filteredCityData = sortedCityData.filter((city) => {
        const { name, cou_name_en, timezone } = city.fields;
        const query = searchQuery.toLowerCase();
        return (
            (name && name.toLowerCase().includes(query)) ||
            (cou_name_en && cou_name_en.toLowerCase().includes(query)) ||
            (timezone && timezone.toLowerCase().includes(query))
        );
    });

    const showCoordinates = (city, longitude, latitude) => {
        navigateTo(`/coordinates/${encodeURIComponent(city)}/${longitude}/${latitude}`);
    };

    const addSpaceAfterSlash = (text) => {
        return text.replace('/', '/ ');
    };

    const handleCityContextMenu = (e, city, longitude, latitude) => {
        e.preventDefault();
        window.open(`/coordinates/${encodeURIComponent(city)}/${longitude}/${latitude}`, '_blank');
    };

    return (
        <div className="xl:w-[600px] lg:w-[450px] md:w-[80vw] w-[94vw] divide-y divide-gray-200  lg:absolute lg:mt-0 mt-10 mx-auto top-[2vw] right-[2vw]">
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none [width:inherit]"
            />

            <div>
                <h2 className='text-2xl font-bold mb-2 flex items-center text-white'>Favorites</h2>
                <table className="table-auto min-w-full mb-2">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">
                                City
                            </th>
                            <th scope="col" className="py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">
                                Country
                            </th>
                            <th scope="col" className="py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">
                                Timezone
                            </th>
                            <th scope="col" className="py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">
                                Favorite
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-left">
                        {cityData
                            .filter(city => favorites.includes(city.recordid))
                            .map(city => (
                                <tr key={city.recordid} className='hover:bg-[#f0f0f0] cursor-pointer'>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-pretty text-center "
                                        onClick={() => showCoordinates(city.fields.ascii_name, city.fields.coordinates[0], city.fields.coordinates[1])}
                                        onContextMenu={(e) => handleCityContextMenu(e, city.fields.ascii_name, city.fields.coordinates[0], city.fields.coordinates[1])}
                                    >
                                        {city.fields.ascii_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-pretty text-center ">{city.fields.cou_name_en}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-pretty text-center ">{addSpaceAfterSlash(city.fields.timezone)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-pretty text-center text-red-600">
                                        <button onClick={() => toggleFavorite(city.recordid)}>
                                            <FaHeart />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div className='overflow-y-scroll h-[500px]'>
                <div className="">
                    {loading ? (
                        <div className='h-[500px] bg-[#f0f0f0] animate-pulse'></div>
                    ) : (
                        <table className="table-auto min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-999 py-3 text-xs font-medium bg-[#f9fafb] text-gray-500 uppercase tracking-wider cursor-pointer w-[150px] "
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center justify-center">
                                            <span>City</span>
                                            {sortBy === 'name' && (
                                                sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-999 py-3 text-xs font-medium bg-[#f9fafb] text-gray-500 uppercase tracking-wider cursor-pointer w-[150px] "
                                        onClick={() => handleSort('cou_name_en')}
                                    >
                                        <div className="flex items-center justify-center">
                                            <span>Country</span>
                                            {sortBy === 'cou_name_en' && (
                                                sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="sticky top-0 z-999 py-3 text-xs font-medium bg-[#f9fafb] text-gray-500 uppercase tracking-wider cursor-pointer w-[150px] "
                                        onClick={() => handleSort('timezone')}
                                    >
                                        <div className="flex items-center justify-center">
                                            <span>Timezone</span>
                                            {sortBy === 'timezone' && (
                                                sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th scope="col" className="sticky top-0 z-999 py-3 text-center text-xs font-medium bg-[#f9fafb] text-gray-500 uppercase tracking-wider w-[150px] ">
                                        <span>Favorite</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-left">
                                {filteredCityData.map((city) => (
                                    <tr key={city.recordid} className="hover:bg-[#f0f0f0] cursor-pointer [text-align-last:center]"  >
                                        <td
                                            className="py-4 whitespace-nowrap text-pretty text-center "
                                            onClick={() => showCoordinates(city.fields.ascii_name, city.fields.coordinates[0], city.fields.coordinates[1])}
                                            onContextMenu={(e) => handleCityContextMenu(e, city.fields.ascii_name, city.fields.coordinates[0], city.fields.coordinates[1])}
                                        >
                                            {city.fields.ascii_name}
                                        </td>
                                        <td className="py-4 whitespace-nowrap text-pretty text-center ">{city.fields.cou_name_en}</td>
                                        <td className="py-4 whitespace-nowrap text-pretty text-center ">{addSpaceAfterSlash(city.fields.timezone)}</td>
                                        <td className="py-4 whitespace-nowrap text-pretty text-center text-red-600">
                                            <button onClick={() => toggleFavorite(city.recordid)}>
                                                {favorites.includes(city.recordid) ? <FaHeart /> : <FaRegHeart />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CityTable;
