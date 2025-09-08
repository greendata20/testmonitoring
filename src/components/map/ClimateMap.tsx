import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Card, Badge } from '../ui';
import { useAppStore } from '../../stores/useAppStore';
import { useClimateData } from '../../hooks/useClimateData';
import { getColorForValue } from '../../utils/dataProcessor';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet 아이콘 문제 해결
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPoint {
  id: string;
  name: string;
  position: [number, number];
  value: number;
  type: 'thermal' | 'vulnerable' | 'solar' | 'carbon';
  data: any;
}

const MapController: React.FC<{ layers: any[] }> = ({ layers }) => {
  const map = useMap();
  
  useEffect(() => {
    const activeLayers = layers.filter(layer => layer.visible);
    if (activeLayers.length > 0) {
      // 활성 레이어가 있을 때 지도 영역 조정
      const bounds = L.latLngBounds([
        [37.4, 126.8],
        [37.7, 127.2]
      ]);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [layers, map]);

  return null;
};

export const ClimateMap: React.FC = () => {
  const { layers } = useAppStore();
  const { thermalComfort, vulnerablePopulation, solarPower } = useClimateData();
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);

  // 실제 데이터를 지도 포인트로 변환
  useEffect(() => {
    const points: MapPoint[] = [];
    
    // 서울 주변의 실제 좌표들 (샘플)
    const seoulDistricts = [
      { name: '중구', position: [37.5641, 126.9979] as [number, number] },
      { name: '종로구', position: [37.5735, 126.9788] as [number, number] },
      { name: '용산구', position: [37.5324, 126.9900] as [number, number] },
      { name: '성동구', position: [37.5636, 127.0366] as [number, number] },
      { name: '광진구', position: [37.5484, 127.0857] as [number, number] },
      { name: '동대문구', position: [37.5838, 127.0507] as [number, number] },
      { name: '중랑구', position: [37.6066, 127.0925] as [number, number] },
      { name: '성북구', position: [37.6028, 127.0179] as [number, number] },
    ];

    // 열쾌적 데이터 포인트
    if (thermalComfort && layers.find(l => l.id === 'thermal-comfort')?.visible) {
      thermalComfort.forEach((item, index) => {
        if (seoulDistricts[index]) {
          points.push({
            id: `thermal-${item.sigun_cd}`,
            name: item.sigun_nm,
            position: seoulDistricts[index].position,
            value: item.whol_livng_ppltn_cnt,
            type: 'thermal',
            data: item
          });
        }
      });
    }

    // 취약인구 데이터 포인트
    if (vulnerablePopulation && layers.find(l => l.id === 'vulnerable-population')?.visible) {
      vulnerablePopulation.forEach((item, index) => {
        if (seoulDistricts[index]) {
          points.push({
            id: `vulnerable-${item.sigun_cd}`,
            name: item.sigun_nm,
            position: seoulDistricts[index].position,
            value: item.clim_vul_snths_scr,
            type: 'vulnerable',
            data: item
          });
        }
      });
    }

    // 태양광 데이터 포인트
    if (solarPower && layers.find(l => l.id === 'solar-potential')?.visible) {
      solarPower.forEach((item, index) => {
        if (seoulDistricts[index]) {
          points.push({
            id: `solar-${item.stdg_cd}`,
            name: item.sigun_nm,
            position: seoulDistricts[index].position,
            value: item.sum_genqy,
            type: 'solar',
            data: item
          });
        }
      });
    }

    setMapPoints(points);
  }, [thermalComfort, vulnerablePopulation, solarPower, layers]);

  const getPointColor = (point: MapPoint) => {
    const layer = layers.find(l => l.id.includes(point.type));
    if (!layer) return '#3b82f6';

    switch (point.type) {
      case 'thermal':
        // 인구수 기반 색상 (높을수록 빨간색)
        return getColorForValue(point.value, 100000, 1000000, ['#22c55e', '#eab308', '#ef4444']);
      case 'vulnerable':
        // 취약성 점수 기반 (높을수록 빨간색)
        return getColorForValue(point.value, 20, 80, ['#22c55e', '#eab308', '#ef4444']);
      case 'solar':
        // 태양광 발전량 기반 (높을수록 노란색)
        return getColorForValue(point.value, 5000, 20000, ['#fbbf24', '#f59e0b', '#d97706']);
      default:
        return layer.color;
    }
  };

  const getPointRadius = (point: MapPoint) => {
    switch (point.type) {
      case 'thermal':
        return Math.max(8, Math.min(25, (point.value / 100000) * 10));
      case 'vulnerable':
        return Math.max(6, Math.min(20, point.value / 4));
      case 'solar':
        return Math.max(8, Math.min(25, point.value / 1000));
      default:
        return 10;
    }
  };

  const formatValue = (point: MapPoint) => {
    switch (point.type) {
      case 'thermal':
        return `${(point.value / 1000).toFixed(1)}K명`;
      case 'vulnerable':
        return `${point.value.toFixed(1)}점`;
      case 'solar':
        return `${(point.value / 1000).toFixed(1)}kW`;
      default:
        return point.value.toString();
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'thermal':
        return '열쾌적 인구';
      case 'vulnerable':
        return '기후취약성';
      case 'solar':
        return '태양광 발전';
      default:
        return type;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-96 w-full rounded-2xl overflow-hidden shadow-2xl relative"
    >
      <MapContainer
        center={[37.5665, 126.9780]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController layers={layers} />

        {mapPoints.map((point) => (
          <CircleMarker
            key={point.id}
            center={point.position}
            radius={getPointRadius(point)}
            fillColor={getPointColor(point)}
            color="#fff"
            weight={2}
            fillOpacity={0.7}
            className="hover:scale-110 transition-transform cursor-pointer"
          >
            <Popup className="custom-popup">
              <Card className="min-w-48 p-0 border-0 shadow-none">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-900">{point.name}</h3>
                    <Badge 
                      variant={
                        point.type === 'vulnerable' && point.value > 60 ? 'danger' :
                        point.type === 'thermal' && point.value > 500000 ? 'warning' :
                        point.type === 'solar' && point.value > 15000 ? 'success' :
                        'default'
                      }
                      size="sm"
                    >
                      {getTypeLabel(point.type)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">수치:</span>
                      <span className="font-semibold text-gray-900">{formatValue(point)}</span>
                    </div>
                    
                    {point.type === 'thermal' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">고위험 인구:</span>
                          <span className="text-sm font-medium text-red-600">
                            {Math.floor((point.data.thrcf_grd8_livng_ppltn_cnt + 
                                       point.data.thrcf_grd9_livng_ppltn_cnt + 
                                       point.data.thrcf_grd10_livng_ppltn_cnt) / 1000)}K명
                          </span>
                        </div>
                      </>
                    )}
                    
                    {point.type === 'vulnerable' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">건강 취약성:</span>
                          <span className="text-sm font-medium">{point.data.hlth_vul_scr.toFixed(1)}점</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">경제적 취약성:</span>
                          <span className="text-sm font-medium">{point.data.ecny_vul_scr.toFixed(1)}점</span>
                        </div>
                      </>
                    )}
                    
                    {point.type === 'solar' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">설치 면적:</span>
                          <span className="text-sm font-medium">
                            {(point.data.sum_area / 1000).toFixed(1)}K㎡
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">효율성:</span>
                          <span className="text-sm font-medium text-green-600">
                            {((point.data.sum_genqy / point.data.sum_area) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* 지도 범례 */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card variant="glass" padding="sm" className="space-y-2">
          <div className="text-sm font-semibold text-gray-800 mb-2">범례</div>
          {layers.filter(layer => layer.visible).map(layer => (
            <div key={layer.id} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: layer.color }}
              />
              <span className="text-gray-700">{layer.name}</span>
            </div>
          ))}
          {layers.filter(layer => layer.visible).length === 0 && (
            <div className="text-xs text-gray-500">레이어를 선택하세요</div>
          )}
        </Card>
      </div>

      {/* 로딩 오버레이 */}
      {mapPoints.length === 0 && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-climate-200 border-t-climate-500 rounded-full animate-spin mx-auto" />
            <p className="text-gray-600">지도 데이터 로딩 중...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};