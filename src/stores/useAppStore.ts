import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  MapLayer, 
  MapViewState, 
  SidebarState, 
  FilterState, 
  PlanningScenario 
} from '../types';

interface AppState {
  // Map state
  mapViewState: MapViewState;
  layers: MapLayer[];
  activeLayers: string[];
  
  // UI state
  sidebar: SidebarState;
  filters: FilterState;
  isLoading: boolean;
  
  // Planning state
  scenarios: PlanningScenario[];
  activeScenario: string | null;
  
  // Actions
  setMapViewState: (viewState: MapViewState) => void;
  toggleLayer: (layerId: string) => void;
  updateLayerOpacity: (layerId: string, opacity: number) => void;
  setSidebarState: (state: Partial<SidebarState>) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setLoading: (loading: boolean) => void;
  addScenario: (scenario: PlanningScenario) => void;
  setActiveScenario: (scenarioId: string | null) => void;
}

const initialMapViewState: MapViewState = {
  longitude: 127.0276,
  latitude: 37.4979,
  zoom: 10,
  pitch: 0,
  bearing: 0,
};

const initialLayers: MapLayer[] = [
  {
    id: 'thermal-comfort',
    name: '열쾌적성',
    type: 'thermal',
    visible: false,
    opacity: 0.7,
    color: '#FF6B6B',
    data: []
  },
  {
    id: 'vulnerable-population',
    name: '기후취약인구',
    type: 'vulnerable',
    visible: false,
    opacity: 0.7,
    color: '#4ECDC4',
    data: []
  },
  {
    id: 'solar-potential',
    name: '태양광 잠재량',
    type: 'solar',
    visible: false,
    opacity: 0.7,
    color: '#FFD93D',
    data: []
  },
  {
    id: 'carbon-emission',
    name: '탄소배출량',
    type: 'carbon',
    visible: false,
    opacity: 0.7,
    color: '#6BCF7F',
    data: []
  },
  {
    id: 'flood-risk',
    name: '홍수위험도',
    type: 'flood',
    visible: false,
    opacity: 0.7,
    color: '#4D96FF',
    data: []
  },
  {
    id: 'park-access',
    name: '공원접근성',
    type: 'park',
    visible: false,
    opacity: 0.7,
    color: '#95D5B2',
    data: []
  },
  {
    id: 'biotop-habitat',
    name: '비오톱서식지',
    type: 'biotop',
    visible: false,
    opacity: 0.7,
    color: '#D4A574',
    data: []
  }
];

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        mapViewState: initialMapViewState,
        layers: initialLayers,
        activeLayers: [],
        
        sidebar: {
          isOpen: true,
          activePanel: 'layers'
        },
        
        filters: {
          region: [],
          thermalGrade: [],
          vulnerabilityLevel: 'all',
          dateRange: null
        },
        
        isLoading: false,
        scenarios: [],
        activeScenario: null,
        
        // Actions
        setMapViewState: (viewState) => 
          set({ mapViewState: viewState }, false, 'setMapViewState'),
        
        toggleLayer: (layerId) => {
          const { layers, activeLayers } = get();
          const updatedLayers = layers.map(layer => 
            layer.id === layerId 
              ? { ...layer, visible: !layer.visible }
              : layer
          );
          
          const updatedActiveLayers = layers.find(l => l.id === layerId)?.visible
            ? activeLayers.filter(id => id !== layerId)
            : [...activeLayers, layerId];
          
          set({ 
            layers: updatedLayers, 
            activeLayers: updatedActiveLayers 
          }, false, 'toggleLayer');
        },
        
        updateLayerOpacity: (layerId, opacity) => {
          const { layers } = get();
          const updatedLayers = layers.map(layer =>
            layer.id === layerId
              ? { ...layer, opacity }
              : layer
          );
          set({ layers: updatedLayers }, false, 'updateLayerOpacity');
        },
        
        setSidebarState: (state) => 
          set(state => ({ 
            sidebar: { ...state.sidebar, ...state } 
          }), false, 'setSidebarState'),
        
        setFilters: (filters) => 
          set(state => ({ 
            filters: { ...state.filters, ...filters } 
          }), false, 'setFilters'),
        
        setLoading: (loading) => 
          set({ isLoading: loading }, false, 'setLoading'),
        
        addScenario: (scenario) => {
          const { scenarios } = get();
          set({ 
            scenarios: [...scenarios, scenario] 
          }, false, 'addScenario');
        },
        
        setActiveScenario: (scenarioId) => 
          set({ activeScenario: scenarioId }, false, 'setActiveScenario'),
      }),
      {
        name: 'climate-urban-planner-store',
        partialize: (state) => ({
          mapViewState: state.mapViewState,
          layers: state.layers,
          sidebar: state.sidebar,
          scenarios: state.scenarios,
        }),
      }
    )
  )
);