import React, { useState } from 'react';
import { disabilityData, nationalStats, disabilityTypeLabels, DisabilityStats } from '../../data/disabilityData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import DisabilityMap from './DisabilityMap';
import DisabilityCharts from './DisabilityCharts';

const DisabilityDashboard: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<DisabilityStats | null>(null);

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  const getDisabilityRateColor = (rate: number) => {
    if (rate < 4.5) return 'text-green-600 bg-green-50';
    if (rate < 5.5) return 'text-yellow-600 bg-yellow-50';
    if (rate < 6.5) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const sortedByRate = [...disabilityData].sort((a, b) => b.disabilityRate - a.disabilityRate);
  const highestRate = sortedByRate[0];
  const lowestRate = sortedByRate[sortedByRate.length - 1];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            대한민국 장애인 현황 통계
          </h1>
          <p className="text-lg text-gray-600">
            2023년 기준 시도별 장애인 등록 현황 및 통계 분석
          </p>
        </div>

        {/* 전국 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              전국 인구
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {formatNumber(nationalStats.totalPopulation)}
            </p>
            <p className="text-sm text-gray-500 mt-1">명</p>
          </Card>
          
          <Card className="p-6 text-center">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              전국 장애인
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {formatNumber(nationalStats.totalDisabled)}
            </p>
            <p className="text-sm text-gray-500 mt-1">명</p>
          </Card>
          
          <Card className="p-6 text-center">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              평균 장애인 비율
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {nationalStats.averageDisabilityRate.toFixed(2)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">전체 인구 대비</p>
          </Card>
          
          <Card className="p-6 text-center">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              최고/최저 지역
            </h3>
            <div className="mt-2">
              <div className="text-sm">
                <span className="text-red-600 font-semibold">{highestRate.region}</span>
                <span className="text-gray-500"> {highestRate.disabilityRate}%</span>
              </div>
              <div className="text-sm">
                <span className="text-green-600 font-semibold">{lowestRate.region}</span>
                <span className="text-gray-500"> {lowestRate.disabilityRate}%</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 지도 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              지역별 장애인 현황 지도
            </h2>
            <DisabilityMap
              data={disabilityData}
              onRegionSelect={setSelectedRegion}
              selectedRegion={selectedRegion}
            />
          </Card>

          {/* 선택된 지역 정보 또는 차트 */}
          <Card className="p-6">
            {selectedRegion ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedRegion.region} 상세 정보
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">전체 인구</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatNumber(selectedRegion.totalPopulation)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">장애인 수</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatNumber(selectedRegion.disabledPopulation)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">장애인 비율</p>
                    <Badge className={`text-lg px-3 py-1 ${getDisabilityRateColor(selectedRegion.disabilityRate)}`}>
                      {selectedRegion.disabilityRate}%
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">장애 유형별 현황</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedRegion.byType).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {disabilityTypeLabels[type as keyof typeof disabilityTypeLabels]}
                          </span>
                          <span className="font-semibold">{formatNumber(count)}명</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">장애 등급별 현황</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">중증</span>
                        <span className="font-semibold">{formatNumber(selectedRegion.byGrade.severe)}명</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">경증</span>
                        <span className="font-semibold">{formatNumber(selectedRegion.byGrade.mild)}명</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  전국 장애 유형별 분포
                </h2>
                <div className="text-center text-gray-500 py-8">
                  <p>지도에서 지역을 클릭하면 상세 정보를 볼 수 있습니다.</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* 차트 섹션 */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            상세 통계 분석
          </h2>
          <DisabilityCharts data={disabilityData} />
        </Card>

        {/* 지역별 상세 테이블 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            시도별 장애인 현황 일람
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    지역
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    전체인구
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    장애인수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    장애인비율
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    중증/경증
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedByRate.map((region) => (
                  <tr 
                    key={region.regionCode}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedRegion(region)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {region.region}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatNumber(region.totalPopulation)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatNumber(region.disabledPopulation)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`text-sm ${getDisabilityRateColor(region.disabilityRate)}`}>
                        {region.disabilityRate}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatNumber(region.byGrade.severe)} / {formatNumber(region.byGrade.mild)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DisabilityDashboard;