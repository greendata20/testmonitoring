import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiLayers, 
  FiBarChart, 
  FiSettings, 
  FiX,
  FiEye,
  FiEyeOff,
  FiSliders
} from 'react-icons/fi';
import { Button, Card, CardHeader, CardTitle, CardContent, Toggle, Slider, Badge } from '../ui';
import { useAppStore } from '../../stores/useAppStore';
import { useClimateData } from '../../hooks/useClimateData';
import { clsx } from 'clsx';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { sidebar, layers, toggleLayer, updateLayerOpacity, setSidebarState } = useAppStore();
  const { statistics, realtimeData, thermalComfort, vulnerablePopulation, solarPower, isLoading } = useClimateData();

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: -400,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const panels = [
    { id: 'layers', name: 'Layers', icon: FiLayers },
    { id: 'analytics', name: 'Analytics', icon: FiBarChart },
    { id: 'planning', name: 'Planning', icon: FiSettings }
  ];

  const renderLayersPanel = () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Control the visibility and opacity of different data layers on the map.
      </div>
      
      {layers.map((layer) => (
        <Card key={layer.id} variant="glass" padding="sm" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: layer.color }}
              />
              <div>
                <h4 className="font-medium text-gray-900">{layer.name}</h4>
                <p className="text-xs text-gray-500 capitalize">{layer.type}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="default" size="sm">
                {layer.type === 'thermal' ? thermalComfort?.length || 0 : 
                 layer.type === 'vulnerable' ? vulnerablePopulation?.length || 0 :
                 layer.type === 'solar' ? solarPower?.length || 0 : 
                 Math.floor(Math.random() * 20) + 5}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLayer(layer.id)}
                className="p-1"
              >
                {layer.visible ? <FiEye size={16} /> : <FiEyeOff size={16} />}
              </Button>
            </div>
          </div>
          
          {layer.visible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-3 border-t border-gray-100"
            >
              <Slider
                label="Opacity"
                value={layer.opacity * 100}
                onChange={(value) => updateLayerOpacity(layer.id, value / 100)}
                min={0}
                max={100}
                unit="%"
                color="climate"
              />
            </motion.div>
          )}
        </Card>
      ))}
    </div>
  );

  const renderAnalyticsPanel = () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Analyze climate data patterns and trends in your selected area.
      </div>
      
      <Card variant="glass" padding="md">
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-climate-600">
                {realtimeData?.temperature?.current || 25}°C
              </div>
              <div className="text-xs text-gray-500">Avg Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-nature-600">
                {statistics?.vulnerable ? Math.floor(statistics.vulnerable.totalVulnerable / 1000) + 'K' : '342'}
              </div>
              <div className="text-xs text-gray-500">Vulnerable Pop</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {statistics?.solar ? Math.floor(statistics.solar.averageEfficiency) + '%' : '85%'}
              </div>
              <div className="text-xs text-gray-500">Solar Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {statistics?.solar ? (statistics.solar.carbonOffset / 1000).toFixed(1) + 't' : '2.3t'}
              </div>
              <div className="text-xs text-gray-500">CO₂ Offset</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card variant="glass" padding="md">
        <CardHeader>
          <CardTitle className="text-lg">Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Heat Risk</span>
              <Badge variant={statistics?.thermal?.averageGrade > 6 ? "danger" : statistics?.thermal?.averageGrade > 4 ? "warning" : "success"}>
                {statistics?.thermal?.averageGrade > 6 ? "High" : statistics?.thermal?.averageGrade > 4 ? "Medium" : "Low"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Flood Risk</span>
              <Badge variant={statistics?.vulnerable?.vulnerabilityRate > 40 ? "danger" : statistics?.vulnerable?.vulnerabilityRate > 20 ? "warning" : "success"}>
                {statistics?.vulnerable?.vulnerabilityRate > 40 ? "High" : statistics?.vulnerable?.vulnerabilityRate > 20 ? "Medium" : "Low"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Air Quality</span>
              <Badge variant={realtimeData?.airQuality?.pm25 < 35 ? "success" : realtimeData?.airQuality?.pm25 < 75 ? "warning" : "danger"}>
                {realtimeData?.airQuality?.pm25 < 35 ? "Good" : realtimeData?.airQuality?.pm25 < 75 ? "Moderate" : "Poor"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlanningPanel = () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Plan climate adaptation strategies and urban improvements.
      </div>
      
      <Card variant="glass" padding="md">
        <CardHeader>
          <CardTitle className="text-lg">Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="primary" fullWidth className="mb-3">
            + New Scenario
          </Button>
          <div className="text-sm text-gray-500 text-center">
            No scenarios created yet
          </div>
        </CardContent>
      </Card>
      
      <Card variant="glass" padding="md">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" fullWidth size="sm">
            🌳 Add Green Space
          </Button>
          <Button variant="outline" fullWidth size="sm">
            ☀️ Solar Panel Analysis
          </Button>
          <Button variant="outline" fullWidth size="sm">
            🚌 Transit Planning
          </Button>
          <Button variant="outline" fullWidth size="sm">
            💧 Water Management
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (sidebar.activePanel) {
      case 'layers':
        return renderLayersPanel();
      case 'analytics':
        return renderAnalyticsPanel();
      case 'planning':
        return renderPlanningPanel();
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebar.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants as any}
        animate={sidebar.isOpen ? "open" : "closed"}
        className="fixed left-0 top-16 bottom-0 w-80 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl z-50 lg:z-30"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="grid grid-cols-3 gap-1 flex-1 mr-3">
              {panels.map((panel) => (
                <Button
                  key={panel.id}
                  variant={sidebar.activePanel === panel.id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setSidebarState({ activePanel: panel.id as any })}
                  className="p-2 text-xs font-medium"
                >
                  <div className="flex flex-col items-center gap-1">
                    <panel.icon size={14} />
                    <span className="leading-none">{panel.name}</span>
                  </div>
                </Button>
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden flex-shrink-0"
            >
              <FiX size={16} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={sidebar.activePanel}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
};