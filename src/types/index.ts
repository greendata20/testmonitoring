// Climate data types
export interface ThermalComfortData {
  sigun_cd: string;
  sigun_nm: string;
  thrcf_grd1_livng_ppltn_cnt: number;
  thrcf_grd2_livng_ppltn_cnt: number;
  thrcf_grd3_livng_ppltn_cnt: number;
  thrcf_grd4_livng_ppltn_cnt: number;
  thrcf_grd5_livng_ppltn_cnt: number;
  thrcf_grd6_livng_ppltn_cnt: number;
  thrcf_grd7_livng_ppltn_cnt: number;
  thrcf_grd8_livng_ppltn_cnt: number;
  thrcf_grd9_livng_ppltn_cnt: number;
  thrcf_grd10_livng_ppltn_cnt: number;
  whol_livng_ppltn_cnt: number;
}

export interface ClimateVulnerablePopulation {
  objectid: number;
  sigun_cd: string;
  sigun_nm: string;
  sigun_ppltn_cnt: number;
  age5udr_ppltn_cnt: number;
  snctz_ppltn_cnt: number;
  pwdbs_ppltn_cnt: number;
  hril_ppltn_cnt: number;
  chds_ppltn_cnt: number;
  clim_vul_snths_scr: number;
  hlth_vul_scr: number;
  ecny_vul_scr: number;
}

export interface SolarPowerData {
  stdg_cd: string;
  stdg_nm: string;
  sgg_cd: string;
  sgg_nm: string;
  sigun_cd: string;
  sigun_nm: string;
  sum_genqy: number;
  sum_area: number;
}

export interface CarbonEmissionData {
  location: string;
  building_electricity: number;
  building_gas: number;
  building_heating: number;
  transport: number;
  total_emission: number;
  biotop_absorption: number;
  plant_storage: number;
  soil_storage: number;
}

// Map related types
export interface MapLayer {
  id: string;
  name: string;
  type: 'thermal' | 'vulnerable' | 'solar' | 'carbon' | 'flood' | 'park' | 'biotop';
  visible: boolean;
  opacity: number;
  color: string;
  data?: any[];
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

// UI types
export interface SidebarState {
  isOpen: boolean;
  activePanel: 'layers' | 'analytics' | 'planning' | null;
}

export interface FilterState {
  region: string[];
  thermalGrade: number[];
  vulnerabilityLevel: 'low' | 'medium' | 'high' | 'all';
  dateRange: [Date, Date] | null;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

// Planning types
export interface PlanningScenario {
  id: string;
  name: string;
  description: string;
  layers: MapLayer[];
  metrics: {
    carbonReduction: number;
    thermalImprovement: number;
    solarCapacity: number;
    greenSpaceIncrease: number;
  };
}