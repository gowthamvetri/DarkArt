import React from 'react';

const ProductFilter = ({ filters, onFilterChange }) => {
    const genderOptions = [
        { value: "", label: "All Genders" },
        { value: "Men", label: "Men" },
        { value: "Women", label: "Women" },
        { value: "Kids", label: "Kids" }
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
            
            {/* Gender Filter */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Gender</h4>
                <div className="space-y-2">
                    {genderOptions.map(option => (
                        <label key={option.value} className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value={option.value}
                                checked={filters.gender === option.value}
                                onChange={(e) => onFilterChange('gender', e.target.value)}
                                className="h-4 w-4 text-black focus:ring-black border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => onFilterChange('minPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>
            </div>

            {/* Clear Filters */}
            <button
                onClick={() => onFilterChange('clear')}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
                Clear All Filters
            </button>
        </div>
    );
};

export default ProductFilter;