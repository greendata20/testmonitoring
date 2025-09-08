import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { DisabilityStats } from '../../data/disabilityData';
import 'leaflet/dist/leaflet.css';

interface DisabilityMapProps {
  data: DisabilityStats[];
  onRegionSelect: (region: DisabilityStats | null) => void;
  selectedRegion: DisabilityStats | null;
}

// 장애인 비율에 따른 색상 결정
const getMarkerColor = (rate: number) => {
  if (rate < 4.5) return '#10b981'; // green
  if (rate < 5.5) return '#f59e0b'; // yellow
  if (rate < 6.5) return '#f97316'; // orange
  return '#ef4444'; // red
};

// 장애인 수에 따른 마커 크기 결정
const getMarkerRadius = (population: number, data: DisabilityStats[]) => {
  const maxPopulation = Math.max(...data.map(d => d.disabledPopulation));
  const minRadius = 8;
  const maxRadius = 25;
  return minRadius + (population / maxPopulation) * (maxRadius - minRadius);
};

const DisabilityMap: React.FC<DisabilityMapProps> = ({ 
  data, 
  onRegionSelect, 
  selectedRegion 
}) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[36.5, 127.5]} // 대한민국 중심
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {data.map((region) => (
          <CircleMarker
            key={region.regionCode}
            center={region.coordinates}
            radius={getMarkerRadius(region.disabledPopulation, data)}
            fillColor={getMarkerColor(region.disabilityRate)}
            color="#ffffff"
            weight={selectedRegion?.regionCode === region.regionCode ? 3 : 1}
            fillOpacity={0.7}
            eventHandlers={{
              click: () => onRegionSelect(region),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{region.region}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>전체 인구:</span>
                    <span className="font-semibold">{formatNumber(region.totalPopulation)}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span>장애인 수:</span>
                    <span className="font-semibold">{formatNumber(region.disabledPopulation)}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span>장애인 비율:</span>
                    <span 
                      className="font-semibold px-2 py-1 rounded text-white text-xs"
                      style={{ backgroundColor: getMarkerColor(region.disabilityRate) }}
                    >
                      {region.disabilityRate}%
                    </span>
                  </div>
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="text-xs text-gray-600 mb-1">주요 장애 유형:</div>
                    <div className="text-xs">
                      <div>지체: {formatNumber(region.byType.physical)}명</div>
                      <div>시각: {formatNumber(region.byType.visual)}명</div>
                      <div>청각: {formatNumber(region.byType.hearing)}명</div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t text-xs text-blue-600 cursor-pointer">
                  클릭하여 상세 정보 보기 →
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      
      {/* 범례 */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg text-xs z-10">
        <div className="font-semibold mb-2">장애인 비율 범례</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#10b981' }}
            ></div>
            <span>4.5% 미만 (낮음)</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#f59e0b' }}
            ></div>
            <span>4.5% - 5.5% (보통)</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#f97316' }}
            ></div>
            <span>5.5% - 6.5% (높음)</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#ef4444' }}
            ></div>
            <span>6.5% 이상 (매우 높음)</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t text-gray-500">
          * 원의 크기: 장애인 수
        </div>
      </div>
    </div>
  );
};

export default DisabilityMap;