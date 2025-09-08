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
  Line,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { useDisabilityStore } from '../../stores/useDisabilityStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FiBarChart, FiPieChart, FiTrendingUp, FiLayers } from 'react-icons/fi';

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6B7280'
];

const StatisticsCharts: React.FC = () => {
  const { stats, filteredRecords, isLoading } = useDisabilityStore();
  const [activeChart, setActiveChart] = useState<'region' | 'gender' | 'type' | 'combined'>('region');

  if (isLoading || !stats) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">통계를 계산하는 중...</span>
        </div>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{formatNumber(entry.value)}명</span>
              {entry.payload.percentage && (
                <span className="text-gray-500 ml-1">
                  ({entry.payload.percentage.toFixed(1)}%)
                </span>
              )}
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
          <p className="font-semibold">{data.name || data.region || data.gender || data.type}</p>
          <p className="text-sm">
            인원: <span className="font-semibold">{formatNumber(data.count || data.value)}명</span>
          </p>
          <p className="text-sm">
            비율: <span className="font-semibold">{(data.percentage || data.percent).toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // 지역별 상위 12개 데이터 (라벨 겹침 방지)
  const topRegionData = stats.regionStats.slice(0, 12).map(item => ({
    name: item.region.length > 6 ? item.region.substring(0, 6) + '...' : item.region,
    fullName: item.region,
    count: item.count,
    percentage: item.percentage
  }));

  // 성별 데이터 (전체 제외, 남성/여성만)
  const genderData = stats.genderStats
    .filter(item => item.gender !== '전체')
    .map(item => ({
      name: item.gender,
      value: item.count,
      percentage: item.percentage
    }));

  // 장애유형별 상위 10개 데이터
  const topTypeData = stats.typeStats.slice(0, 10).map(item => ({
    name: item.type.length > 10 ? item.type.substring(0, 10) + '...' : item.type,
    fullName: item.type,
    count: item.count,
    percentage: item.percentage
  }));

  // 복합 데이터 (지역별 성별 분포)
  const combinedData = stats.regionStats.slice(0, 10).map(regionStat => {
    const regionRecords = filteredRecords.filter(r => r.region === regionStat.region);
    const maleCount = regionRecords.filter(r => r.gender === '남성').reduce((sum, r) => sum + r.count, 0);
    const femaleCount = regionRecords.filter(r => r.gender === '여성').reduce((sum, r) => sum + r.count, 0);
    
    return {
      name: regionStat.region.length > 8 ? regionStat.region.substring(0, 8) + '...' : regionStat.region,
      fullName: regionStat.region,
      male: maleCount,
      female: femaleCount,
      total: maleCount + femaleCount
    };
  });

  return (
    <div className="space-y-6">
      {/* 차트 선택 버튼 */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          onClick={() => setActiveChart('region')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeChart === 'region'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FiBarChart />
          지역별 현황
        </Button>
        <Button
          onClick={() => setActiveChart('gender')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeChart === 'gender'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FiPieChart />
          성별 분포
        </Button>
        <Button
          onClick={() => setActiveChart('type')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeChart === 'type'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FiTrendingUp />
          장애유형별
        </Button>
        <Button
          onClick={() => setActiveChart('combined')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeChart === 'combined'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FiLayers />
          복합 분석
        </Button>
      </div>

      {/* 지역별 차트 */}
      {activeChart === 'region' && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-center">
            지역별 장애인 현황 (상위 12개 지역)
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topRegionData} margin={{ top: 20, right: 30, left: 100, bottom: 90 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  fontSize={12}
                  interval={0}
                  tick={{ dy: 10 }}
                />
                <YAxis 
                  label={{ 
                    value: '인원 수 (명)', 
                    angle: -90, 
                    position: 'outside',
                    style: { textAnchor: 'middle' }
                  }}
                  tickFormatter={formatNumber}
                  width={90}
                  fontSize={10}
                  tick={{ dx: -15 }}
                  axisLine={true}
                  tickLine={true}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">지역별 주요 통계</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <span className="font-medium">최다 지역:</span> {stats.regionStats[0]?.region}
              </div>
              <div>
                <span className="font-medium">최다 인원:</span> {formatNumber(stats.regionStats[0]?.count || 0)}명
              </div>
              <div>
                <span className="font-medium">전체 지역:</span> {stats.regionStats.length}개
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 성별 차트 */}
      {activeChart === 'gender' && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-center">
            성별 장애인 분포
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                    labelLine={false}
                  >
                    {genderData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">상세 현황</h4>
              {stats.genderStats.filter(item => item.gender !== '전체').map((item, index) => (
                <div key={item.gender} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="font-medium">{item.gender}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatNumber(item.count)}명</div>
                    <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* 장애유형별 차트 */}
      {activeChart === 'type' && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-center">
            장애유형별 현황 (상위 10개 유형)
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTypeData} margin={{ top: 20, right: 30, left: 100, bottom: 120 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={130}
                  fontSize={12}
                  interval={0}
                  tick={{ dy: 10 }}
                />
                <YAxis 
                  label={{ 
                    value: '인원 수 (명)', 
                    angle: -90, 
                    position: 'outside',
                    style: { textAnchor: 'middle' }
                  }}
                  tickFormatter={formatNumber}
                  width={90}
                  fontSize={10}
                  tick={{ dx: -15 }}
                  axisLine={true}
                  tickLine={true}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">장애유형별 주요 통계</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-green-800">
              <div>
                <span className="font-medium">최다 유형:</span> {stats.typeStats[0]?.type}
              </div>
              <div>
                <span className="font-medium">최다 인원:</span> {formatNumber(stats.typeStats[0]?.count || 0)}명
              </div>
              <div>
                <span className="font-medium">전체 유형:</span> {stats.typeStats.length}개
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 복합 차트 */}
      {activeChart === 'combined' && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-center">
            지역별 성별 분포 현황 (상위 10개 지역)
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={combinedData} margin={{ top: 20, right: 30, left: 100, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={110}
                  fontSize={12}
                  interval={0}
                  tick={{ dy: 10 }}
                />
                <YAxis 
                  label={{ 
                    value: '인원 수 (명)', 
                    angle: -90, 
                    position: 'outside',
                    style: { textAnchor: 'middle' }
                  }}
                  tickFormatter={formatNumber}
                  width={90}
                  fontSize={10}
                  tick={{ dx: -15 }}
                  axisLine={true}
                  tickLine={true}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="male" stackId="stack" fill="#3B82F6" name="남성" />
                <Bar dataKey="female" stackId="stack" fill="#EC4899" name="여성" />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  name="전체"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">복합 분석 인사이트</h4>
            <div className="text-sm text-purple-800 space-y-1">
              <p>• 지역별 성별 분포의 차이를 한눈에 확인할 수 있습니다</p>
              <p>• 막대는 성별 구성을, 선 그래프는 전체 현황을 나타냅니다</p>
              <p>• 각 지역의 특성과 패턴을 비교분석할 수 있습니다</p>
            </div>
          </div>
        </Card>
      )}

      {/* 전체 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100">
          <h4 className="text-sm font-medium text-blue-600 uppercase tracking-wide">전체 인원</h4>
          <p className="text-2xl font-bold text-blue-900 mt-2">
            {formatNumber(stats.totalCount)}
          </p>
          <p className="text-sm text-blue-600 mt-1">명</p>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100">
          <h4 className="text-sm font-medium text-green-600 uppercase tracking-wide">전체 지역</h4>
          <p className="text-2xl font-bold text-green-900 mt-2">
            {stats.regionStats.length}
          </p>
          <p className="text-sm text-green-600 mt-1">개</p>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-yellow-100 to-yellow-200" style={{backgroundColor: '#fef3c7'}}>
          <h4 className="text-sm font-medium text-yellow-700 uppercase tracking-wide">장애유형</h4>
          <p className="text-2xl font-bold text-yellow-800 mt-2">
            {stats.typeStats.length}
          </p>
          <p className="text-sm text-yellow-700 mt-1">개</p>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-orange-100">
          <h4 className="text-sm font-medium text-orange-600 uppercase tracking-wide">데이터 레코드</h4>
          <p className="text-2xl font-bold text-orange-900 mt-2">
            {formatNumber(filteredRecords.length)}
          </p>
          <p className="text-sm text-orange-600 mt-1">개</p>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsCharts;