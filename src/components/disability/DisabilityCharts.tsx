import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import type { DisabilityStats } from '../../data/disabilityData';
import { disabilityTypeLabels, nationalStats } from '../../data/disabilityData';
import { Button } from '../ui/Button';

interface DisabilityChartsProps {
  data: DisabilityStats[];
}

const COLORS = {
  physical: '#3b82f6',
  visual: '#ef4444',
  hearing: '#f59e0b',
  speech: '#10b981',
  intellectual: '#8b5cf6',
  mental: '#f97316',
  others: '#6b7280'
};

const DisabilityCharts: React.FC<DisabilityChartsProps> = ({ data }) => {
  const [activeChart, setActiveChart] = useState<'bar' | 'pie' | 'line'>('bar');

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  // 장애인 비율 상위/하위 10개 지역
  const sortedByRate = [...data].sort((a, b) => b.disabilityRate - a.disabilityRate);
  const top10 = sortedByRate.slice(0, 10);
  const bottom10 = sortedByRate.slice(-10).reverse();

  // 장애 유형별 전국 데이터
  const typeData = Object.entries(nationalStats.totalByType).map(([type, count]) => ({
    type: disabilityTypeLabels[type as keyof typeof disabilityTypeLabels],
    count,
    percentage: ((count / nationalStats.totalDisabled) * 100).toFixed(1)
  }));

  // 인구 대비 장애인 비율 차트 데이터
  const rateData = data.map(region => ({
    region: region.region.replace(/특별시|광역시|특별자치시|특별자치도|도$/g, ''),
    rate: region.disabilityRate,
    population: region.disabledPopulation
  })).sort((a, b) => b.rate - a.rate);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'rate' ? '장애인 비율: ' : '장애인 수: '}
              <span className="font-semibold">
                {entry.dataKey === 'rate' 
                  ? `${entry.value}%` 
                  : formatNumber(entry.value)}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.type}</p>
          <p className="text-sm">
            인원: <span className="font-semibold">{formatNumber(data.count)}명</span>
          </p>
          <p className="text-sm">
            비율: <span className="font-semibold">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 차트 선택 버튼 */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => setActiveChart('bar')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeChart === 'bar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          지역별 비율
        </Button>
        <Button
          onClick={() => setActiveChart('pie')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeChart === 'pie'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          장애 유형별 분포
        </Button>
        <Button
          onClick={() => setActiveChart('line')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeChart === 'line'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          전체 현황 추세
        </Button>
      </div>

      {/* 바 차트 - 지역별 장애인 비율 */}
      {activeChart === 'bar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">
              장애인 비율 상위 10개 지역
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={top10} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="region" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  label={{ value: '장애인 비율 (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="disabilityRate" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">
              장애인 비율 하위 10개 지역
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={bottom10} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="region" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  label={{ value: '장애인 비율 (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="disabilityRate" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 파이 차트 - 장애 유형별 분포 */}
      {activeChart === 'pie' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">
              전국 장애 유형별 분포
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ type, percentage }) => `${type} ${percentage}%`}
                  labelLine={false}
                >
                  {typeData.map((entry, index) => {
                    const colorKey = Object.keys(disabilityTypeLabels).find(
                      key => disabilityTypeLabels[key as keyof typeof disabilityTypeLabels] === entry.type
                    ) as keyof typeof COLORS;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[colorKey]} 
                      />
                    );
                  })}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">장애 유형별 상세 현황</h3>
            <div className="space-y-3">
              {typeData.map((item, index) => {
                const colorKey = Object.keys(disabilityTypeLabels).find(
                  key => disabilityTypeLabels[key as keyof typeof disabilityTypeLabels] === item.type
                ) as keyof typeof COLORS;
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[colorKey] }}
                      ></div>
                      <span className="font-medium">{item.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatNumber(item.count)}명</div>
                      <div className="text-sm text-gray-500">{item.percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">주요 통계</h4>
              <div className="text-sm text-blue-800">
                <p>• 가장 많은 유형: 지체장애 ({((nationalStats.totalByType.physical / nationalStats.totalDisabled) * 100).toFixed(1)}%)</p>
                <p>• 전체 장애인 수: {formatNumber(nationalStats.totalDisabled)}명</p>
                <p>• 전국 평균 장애인 비율: {nationalStats.averageDisabilityRate.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 라인 차트 - 전체 지역 장애인 비율 추세 */}
      {activeChart === 'line' && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">
            전국 시도별 장애인 비율 현황
          </h3>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={rateData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="region"
                angle={-45}
                textAnchor="end"
                height={120}
                fontSize={11}
              />
              <YAxis 
                label={{ value: '장애인 비율 (%)', angle: -90, position: 'insideLeft' }}
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-red-900">최고 비율</h4>
              <p className="text-lg font-bold text-red-600">{rateData[0].region}</p>
              <p className="text-2xl font-bold text-red-600">{rateData[0].rate}%</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-blue-900">전국 평균</h4>
              <p className="text-lg font-bold text-blue-600">전체 지역</p>
              <p className="text-2xl font-bold text-blue-600">{nationalStats.averageDisabilityRate.toFixed(2)}%</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-green-900">최저 비율</h4>
              <p className="text-lg font-bold text-green-600">{rateData[rateData.length - 1].region}</p>
              <p className="text-2xl font-bold text-green-600">{rateData[rateData.length - 1].rate}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisabilityCharts;