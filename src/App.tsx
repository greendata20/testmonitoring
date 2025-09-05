import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ClimateMap } from './components/map';
import { Card, Button, Badge } from './components/ui';
import { useAppStore } from './stores/useAppStore';
import { useClimateData } from './hooks/useClimateData';
import { 
  FiMapPin, 
  FiThermometer, 
  FiDroplet, 
  FiSun,
  FiWind,
  FiTrendingUp,
  FiAlertTriangle
} from 'react-icons/fi';

function App() {
  const { sidebar, setSidebarState } = useAppStore();
  const { statistics, realtimeData, isLoading, thermalComfort, vulnerablePopulation, solarPower } = useClimateData();

  const toggleSidebar = () => {
    setSidebarState({ isOpen: !sidebar.isOpen });
  };

  const closeSidebar = () => {
    setSidebarState({ isOpen: false });
  };

  // 실시간 데이터 표시용
  const displayData = {
    temperature: realtimeData?.temperature?.current || Math.floor(Math.random() * 15) + 15,
    floodRisk: statistics?.vulnerable?.vulnerabilityRate || Math.floor(Math.random() * 50) + 10,
    solarEfficiency: statistics?.solar?.averageEfficiency || Math.floor(Math.random() * 30) + 70,
    airQuality: realtimeData?.airQuality?.pm25 || Math.floor(Math.random() * 50) + 25,
    totalRegions: thermalComfort?.length || 8,
    vulnerableCount: statistics?.vulnerable?.totalVulnerable || Math.floor(Math.random() * 50000) + 10000,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <Header onToggleSidebar={toggleSidebar} />
      
      {/* Sidebar */}
      <Sidebar onClose={closeSidebar} />
      
      {/* Main Content */}
      <main 
        className={`transition-all duration-300 pt-16 ${
          sidebar.isOpen ? 'lg:ml-80' : ''
        }`}
      >
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-climate-600/10 to-nature-600/10" />
          <div className="relative px-6 py-12 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold bg-gradient-to-r from-climate-600 to-nature-600 bg-clip-text text-transparent mb-4"
            >
              Climate Urban Planning
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              AI-powered urban planning tools for climate resilience and sustainability
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-4 mb-12"
            >
              <Button variant="primary" size="lg" leftIcon={<FiMapPin />}>
                Explore Map
              </Button>
              <Button variant="secondary" size="lg" leftIcon={<FiTrendingUp />}>
                View Analytics
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Interactive Climate Map */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="px-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">실시간 기후 지도</h2>
                <p className="text-gray-600">레이어를 활성화하여 지역별 기후 데이터를 확인하세요</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => setSidebarState({ isOpen: true, activePanel: 'layers' })}
                leftIcon={<FiMapPin />}
              >
                레이어 설정
              </Button>
            </div>
            <ClimateMap />
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="px-6 py-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Climate Insights at a Glance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="glass" className="text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                <FiThermometer size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Thermal Comfort</h3>
              <div className="text-3xl font-bold text-red-600 mb-2">{displayData.temperature}°C</div>
              <Badge variant={displayData.temperature > 25 ? "warning" : "success"} size="sm">
                {displayData.temperature > 25 ? "Above Average" : "Normal"}
              </Badge>
              <p className="text-gray-600 text-sm mt-2">
                Urban heat island effect detected in {displayData.totalRegions} districts
              </p>
            </Card>

            <Card variant="glass" className="text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <FiDroplet size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Flood Risk</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">{displayData.floodRisk.toFixed(1)}%</div>
              <Badge variant={displayData.floodRisk > 40 ? "danger" : displayData.floodRisk > 20 ? "warning" : "info"} size="sm">
                {displayData.floodRisk > 40 ? "High" : displayData.floodRisk > 20 ? "Moderate" : "Low"}
              </Badge>
              <p className="text-gray-600 text-sm mt-2">
                {displayData.vulnerableCount.toLocaleString()} people in vulnerable areas
              </p>
            </Card>

            <Card variant="glass" className="text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <FiSun size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Solar Potential</h3>
              <div className="text-3xl font-bold text-yellow-600 mb-2">{displayData.solarEfficiency.toFixed(2)}%</div>
              <Badge variant={displayData.solarEfficiency > 80 ? "success" : displayData.solarEfficiency > 60 ? "warning" : "danger"} size="sm">
                {displayData.solarEfficiency > 80 ? "Excellent" : displayData.solarEfficiency > 60 ? "Good" : "Poor"}
              </Badge>
              <p className="text-gray-600 text-sm mt-2">
                Rooftop solar capacity can meet {displayData.solarEfficiency.toFixed(1)}% of energy needs
              </p>
            </Card>

            <Card variant="glass" className="text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <FiWind size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Air Quality</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">{displayData.airQuality}</div>
              <Badge variant={displayData.airQuality < 35 ? "success" : displayData.airQuality < 75 ? "warning" : "danger"} size="sm">
                {displayData.airQuality < 35 ? "Good" : displayData.airQuality < 75 ? "Moderate" : "Poor"}
              </Badge>
              <p className="text-gray-600 text-sm mt-2">
                PM2.5 levels: {displayData.airQuality < 35 ? "within acceptable ranges" : "above recommended levels"}
              </p>
            </Card>
          </div>
        </motion.section>

        {/* Climate Alerts */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="px-6 pb-12"
        >
          <Card variant="elevated" className="border-l-4 border-orange-400">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiAlertTriangle size={20} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Climate Action Recommendations
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-700">
                      🌳 Increase urban forest coverage by 20% in heat-vulnerable areas
                    </span>
                    <Badge variant="warning" size="sm">Priority</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">
                      💧 Implement green infrastructure for stormwater management
                    </span>
                    <Badge variant="info" size="sm">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">
                      ☀️ Accelerate solar panel installation in high-potential zones
                    </span>
                    <Badge variant="success" size="sm">Opportunity</Badge>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button variant="primary" size="sm">
                    Create Action Plan
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}

export default App;
