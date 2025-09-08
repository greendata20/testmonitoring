import React, { useState, useEffect } from 'react';
import { useDisabilityStore } from '../../stores/useDisabilityStore';
import type { DisabilityFilters } from '../../stores/useDisabilityStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FiSearch, FiFilter, FiX, FiRefreshCw } from 'react-icons/fi';

const SearchFilters: React.FC = () => {
  const { rawData, filters, setFilters, clearFilters, loadData, isLoading } = useDisabilityStore();
  const [searchText, setSearchText] = useState(filters.searchText || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 사용 가능한 옵션들
  const regions = rawData?.summary.regions.filter(r => r !== '전체') || [];
  const disabilityTypes = rawData?.summary.disabilityTypes.filter(t => t !== '전체장애') || [];
  const genders = rawData?.summary.genders.filter(g => g !== '전체') || [];

  useEffect(() => {
    if (!rawData && !isLoading) {
      loadData();
    }
  }, [rawData, isLoading, loadData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ searchText: searchText.trim() || undefined });
  };

  const handleFilterChange = (key: keyof DisabilityFilters, value: string) => {
    setFilters({ [key]: value === '전체' ? undefined : value });
  };

  const handleClearFilters = () => {
    setSearchText('');
    clearFilters();
    setShowAdvancedFilters(false);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        {/* 검색 바 */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="지역, 장애유형 등을 검색하세요..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button type="submit" className="px-4 py-2">
            검색
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-2 flex items-center gap-2 ${showAdvancedFilters ? 'bg-blue-50 text-blue-600' : ''}`}
          >
            <FiFilter />
            필터 {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
          {activeFiltersCount > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              className="px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50"
            >
              <FiX />
              초기화
            </Button>
          )}
        </form>

        {/* 고급 필터 */}
        {showAdvancedFilters && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 지역 필터 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  지역
                </label>
                <select
                  value={filters.region || '전체'}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="전체">전체 지역</option>
                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* 성별 필터 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  성별
                </label>
                <select
                  value={filters.gender || '전체'}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="전체">전체</option>
                  {genders.map(gender => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              {/* 장애유형 필터 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  장애유형
                </label>
                <select
                  value={filters.disabilityType || '전체'}
                  onChange={(e) => handleFilterChange('disabilityType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="전체">전체 유형</option>
                  {disabilityTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 활성 필터 표시 */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <span className="text-sm font-medium text-gray-700">활성 필터:</span>
                {filters.region && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    지역: {filters.region}
                    <button
                      onClick={() => setFilters({ region: undefined })}
                      className="ml-1 hover:text-blue-600"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {filters.gender && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    성별: {filters.gender}
                    <button
                      onClick={() => setFilters({ gender: undefined })}
                      className="ml-1 hover:text-green-600"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {filters.disabilityType && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    유형: {filters.disabilityType}
                    <button
                      onClick={() => setFilters({ disabilityType: undefined })}
                      className="ml-1 hover:text-purple-600"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {filters.searchText && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                    검색: {filters.searchText}
                    <button
                      onClick={() => {
                        setSearchText('');
                        setFilters({ searchText: undefined });
                      }}
                      className="ml-1 hover:text-orange-600"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* 데이터 새로고침 버튼 */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            {rawData && (
              <span>
                총 {rawData.summary.totalRecords.toLocaleString()}개 레코드 
                ({rawData.summary.totalCount.toLocaleString()}명)
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? '로딩 중...' : '데이터 새로고침'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SearchFilters;