import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDisabilityStore } from '../../stores/useDisabilityStore';
import type { DisabilityRecord } from '../../utils/excelParser';
import SearchFilters from './SearchFilters';
import DataTable from './DataTable';
import StatisticsCharts from './StatisticsCharts';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  FiDatabase, 
  FiBarChart, 
  FiTable, 
  FiInfo,
  FiRefreshCw,
  FiAlertCircle
} from 'react-icons/fi';

const DisabilityMonitoringApp: React.FC = () => {
  const { rawData, filteredRecords, stats, isLoading, error, loadData } = useDisabilityStore();
  const [activeView, setActiveView] = useState<'dashboard' | 'table' | 'charts'>('dashboard');
  const [selectedRecord, setSelectedRecord] = useState<DisabilityRecord | null>(null);

  useEffect(() => {
    if (!rawData && !isLoading) {
      loadData();
    }
  }, [rawData, isLoading, loadData]);

  const handleRecordSelect = (record: DisabilityRecord) => {
    setSelectedRecord(record);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 헤더 */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                장애인 현황 모니터링 시스템
              </h1>
              <p className="text-gray-600 mt-1">
                지역별, 성별, 유형별 장애인 통계 데이터 분석 및 모니터링
              </p>
            </div>
            <div className="flex items-center gap-4">
              {rawData && (
                <div className="text-sm text-gray-600 text-right">
                  <div>마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}</div>
                  <div>총 {formatNumber(rawData.summary.totalRecords)}개 레코드</div>
                </div>
              )}
              <Button
                variant="outline"
                onClick={loadData}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
                새로고침
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 오류 표시 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center gap-3 text-red-800">
                <FiAlertCircle className="text-red-500" />
                <div>
                  <p className="font-semibold">오류가 발생했습니다</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 네비게이션 탭 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <Button
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeView === 'dashboard'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            <FiDatabase />
            대시보드
          </Button>
          <Button
            onClick={() => setActiveView('charts')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeView === 'charts'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            <FiBarChart />
            통계 차트
          </Button>
          <Button
            onClick={() => setActiveView('table')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeView === 'table'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            <FiTable />
            데이터 테이블
          </Button>
        </motion.div>

        {/* 검색 필터 (모든 뷰에서 공통) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SearchFilters />
        </motion.div>

        {/* 뷰별 콘텐츠 */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* 대시보드 뷰 */}
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* 요약 통계 카드 */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 rounded-xl flex items-center justify-center">
                      <FiDatabase className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-900">전체 인원</h3>
                    <p className="text-3xl font-bold text-blue-600">{formatNumber(stats.totalCount)}</p>
                    <p className="text-sm text-blue-700 mt-1">명</p>
                  </Card>

                  <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 mx-auto mb-4 bg-green-600 rounded-xl flex items-center justify-center">
                      <FiBarChart3 className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-green-900">지역 수</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.regionStats.length}</p>
                    <p className="text-sm text-green-700 mt-1">개 지역</p>
                  </Card>

                  <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 mx-auto mb-4 bg-purple-600 rounded-xl flex items-center justify-center">
                      <FiInfo className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-900">장애유형</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.typeStats.length}</p>
                    <p className="text-sm text-purple-700 mt-1">개 유형</p>
                  </Card>

                  <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 mx-auto mb-4 bg-orange-600 rounded-xl flex items-center justify-center">
                      <FiTable className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-orange-900">필터링된 레코드</h3>
                    <p className="text-3xl font-bold text-orange-600">{formatNumber(filteredRecords.length)}</p>
                    <p className="text-sm text-orange-700 mt-1">개 레코드</p>
                  </Card>
                </div>
              )}

              {/* 상위 통계 */}
              {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 상위 지역 */}
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">상위 10개 지역</h3>
                    <div className="space-y-3">
                      {stats.regionStats.slice(0, 10).map((item, index) => (
                        <div key={item.region} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <Badge className={`text-sm ${
                              index < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              #{index + 1}
                            </Badge>
                            <span className="font-medium">{item.region}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatNumber(item.count)}명</div>
                            <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* 상위 장애유형 */}
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">주요 장애유형</h3>
                    <div className="space-y-3">
                      {stats.typeStats.slice(0, 10).map((item, index) => (
                        <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <Badge className={`text-sm ${
                              index < 3 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              #{index + 1}
                            </Badge>
                            <span className="font-medium">{item.type}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatNumber(item.count)}명</div>
                            <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* 차트 뷰 */}
          {activeView === 'charts' && (
            <StatisticsCharts />
          )}

          {/* 테이블 뷰 */}
          {activeView === 'table' && (
            <DataTable onRecordSelect={handleRecordSelect} />
          )}
        </motion.div>

        {/* 선택된 레코드 상세 정보 모달 */}
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">상세 정보</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">지역:</span>
                  <span className="text-gray-900">{selectedRecord.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">성별:</span>
                  <Badge className={
                    selectedRecord.gender === '남성' 
                      ? 'bg-blue-100 text-blue-800'
                      : selectedRecord.gender === '여성'
                      ? 'bg-pink-100 text-pink-800'
                      : 'bg-gray-100 text-gray-800'
                  }>
                    {selectedRecord.gender}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">장애유형:</span>
                  <span className="text-gray-900">{selectedRecord.disabilityType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">인원수:</span>
                  <span className="font-semibold text-lg text-blue-600">
                    {formatNumber(selectedRecord.count)}명
                  </span>
                </div>
                {selectedRecord.year && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">연도:</span>
                    <span className="text-gray-900">{selectedRecord.year}</span>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <span className="font-medium text-gray-700">ID:</span>
                  <span className="text-sm text-gray-500 ml-2">{selectedRecord.id}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default DisabilityMonitoringApp;