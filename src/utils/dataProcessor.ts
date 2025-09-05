import type { 
  ThermalComfortData, 
  ClimateVulnerablePopulation, 
  SolarPowerData, 
  CarbonEmissionData,
  MapLayer
} from '../types';

// CSV 파싱 유틸리티
export const parseCSV = <T>(csvText: string, parser: (row: string[]) => T): T[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.replace(/"/g, ''));
    return parser(values);
  });
};

// 열쾌적성 데이터 파서
export const parseThermalComfortData = (row: string[]): ThermalComfortData => ({
  sigun_cd: row[0],
  sigun_nm: row[1],
  thrcf_grd1_livng_ppltn_cnt: parseFloat(row[2]) || 0,
  thrcf_grd2_livng_ppltn_cnt: parseFloat(row[3]) || 0,
  thrcf_grd3_livng_ppltn_cnt: parseFloat(row[4]) || 0,
  thrcf_grd4_livng_ppltn_cnt: parseFloat(row[5]) || 0,
  thrcf_grd5_livng_ppltn_cnt: parseFloat(row[6]) || 0,
  thrcf_grd6_livng_ppltn_cnt: parseFloat(row[7]) || 0,
  thrcf_grd7_livng_ppltn_cnt: parseFloat(row[8]) || 0,
  thrcf_grd8_livng_ppltn_cnt: parseFloat(row[9]) || 0,
  thrcf_grd9_livng_ppltn_cnt: parseFloat(row[10]) || 0,
  thrcf_grd10_livng_ppltn_cnt: parseFloat(row[11]) || 0,
  whol_livng_ppltn_cnt: parseFloat(row[12]) || 0,
});

// 기후취약인구 데이터 파서
export const parseClimateVulnerableData = (row: string[]): ClimateVulnerablePopulation => ({
  objectid: parseInt(row[0]) || 0,
  sigun_cd: row[2],
  sigun_nm: row[3],
  sigun_ppltn_cnt: parseInt(row[4]) || 0,
  age5udr_ppltn_cnt: parseInt(row[5]) || 0,
  snctz_ppltn_cnt: parseInt(row[6]) || 0,
  pwdbs_ppltn_cnt: parseInt(row[7]) || 0,
  hril_ppltn_cnt: parseInt(row[8]) || 0,
  chds_ppltn_cnt: parseInt(row[9]) || 0,
  clim_vul_snths_scr: parseFloat(row[36]) || 0,
  hlth_vul_scr: parseFloat(row[34]) || 0,
  ecny_vul_scr: parseFloat(row[35]) || 0,
});

// 태양광 데이터 파서
export const parseSolarPowerData = (row: string[]): SolarPowerData => ({
  stdg_cd: row[1],
  stdg_nm: row[2],
  sgg_cd: row[3],
  sgg_nm: row[4],
  sigun_cd: row[5],
  sigun_nm: row[6],
  sum_genqy: parseFloat(row[7]) || 0,
  sum_area: parseFloat(row[8]) || 0,
});

// 데이터 집계 및 통계 계산
export class DataProcessor {
  static calculateThermalComfortStats(data: ThermalComfortData[]) {
    const totalPopulation = data.reduce((sum, item) => sum + item.whol_livng_ppltn_cnt, 0);
    
    const gradeDistribution = Array.from({ length: 10 }, (_, i) => {
      const gradeKey = `thrcf_grd${i + 1}_livng_ppltn_cnt` as keyof ThermalComfortData;
      const gradeTotal = data.reduce((sum, item) => sum + (item[gradeKey] as number), 0);
      return {
        grade: i + 1,
        population: gradeTotal,
        percentage: (gradeTotal / totalPopulation) * 100
      };
    });

    // 위험도 계산 (등급 8-10이 위험)
    const highRiskPopulation = gradeDistribution
      .slice(7, 10)
      .reduce((sum, grade) => sum + grade.population, 0);

    return {
      totalPopulation,
      gradeDistribution,
      highRiskPopulation,
      highRiskPercentage: (highRiskPopulation / totalPopulation) * 100,
      averageGrade: this.calculateWeightedAverage(gradeDistribution)
    };
  }

  static calculateVulnerabilityStats(data: ClimateVulnerablePopulation[]) {
    const totalPopulation = data.reduce((sum, item) => sum + item.sigun_ppltn_cnt, 0);
    const totalVulnerable = data.reduce((sum, item) => 
      sum + item.age5udr_ppltn_cnt + item.snctz_ppltn_cnt + item.pwdbs_ppltn_cnt, 0);

    const avgHealthVulnerability = data.reduce((sum, item) => sum + item.hlth_vul_scr, 0) / data.length;
    const avgEconomicVulnerability = data.reduce((sum, item) => sum + item.ecny_vul_scr, 0) / data.length;
    const avgClimateVulnerability = data.reduce((sum, item) => sum + item.clim_vul_snths_scr, 0) / data.length;

    return {
      totalPopulation,
      totalVulnerable,
      vulnerabilityRate: (totalVulnerable / totalPopulation) * 100,
      avgHealthVulnerability,
      avgEconomicVulnerability,
      avgClimateVulnerability,
      highRiskAreas: data.filter(item => item.clim_vul_snths_scr > 70).length
    };
  }

  static calculateSolarPotential(data: SolarPowerData[]) {
    const totalGeneration = data.reduce((sum, item) => sum + item.sum_genqy, 0);
    const totalArea = data.reduce((sum, item) => sum + item.sum_area, 0);
    const averageEfficiency = totalGeneration / totalArea;

    const topPerformers = data
      .sort((a, b) => (b.sum_genqy / b.sum_area) - (a.sum_genqy / a.sum_area))
      .slice(0, 10);

    return {
      totalGeneration,
      totalArea,
      averageEfficiency,
      topPerformers,
      estimatedAnnualSaving: totalGeneration * 150, // 가정: kWh당 150원
      carbonOffset: totalGeneration * 0.4277 // kWh당 CO2 배출계수
    };
  }

  private static calculateWeightedAverage(distribution: Array<{ grade: number; population: number }>) {
    const totalWeightedSum = distribution.reduce((sum, item) => sum + (item.grade * item.population), 0);
    const totalPopulation = distribution.reduce((sum, item) => sum + item.population, 0);
    return totalWeightedSum / totalPopulation;
  }

  // 지도 레이어용 데이터 변환
  static convertToMapLayer(
    id: string, 
    name: string, 
    type: MapLayer['type'],
    data: any[], 
    color: string
  ): MapLayer {
    return {
      id,
      name,
      type,
      visible: false,
      opacity: 0.7,
      color,
      data: data.map(item => ({
        ...item,
        coordinates: this.getCoordinatesForRegion(item.sigun_cd || item.stdg_cd),
        value: this.extractPrimaryValue(item, type)
      }))
    };
  }

  private static getCoordinatesForRegion(regionCode: string): [number, number] {
    // 실제로는 지역코드에 따른 좌표 매핑이 필요
    // 여기서는 서울 주변의 랜덤 좌표로 시뮬레이션
    const baseLatitude = 37.5665;
    const baseLongitude = 126.9780;
    const randomLat = baseLatitude + (Math.random() - 0.5) * 0.5;
    const randomLng = baseLongitude + (Math.random() - 0.5) * 0.5;
    return [randomLng, randomLat];
  }

  private static extractPrimaryValue(item: any, type: MapLayer['type']): number {
    switch (type) {
      case 'thermal':
        return item.whol_livng_ppltn_cnt || 0;
      case 'vulnerable':
        return item.clim_vul_snths_scr || 0;
      case 'solar':
        return item.sum_genqy || 0;
      case 'carbon':
        return item.total_emission || 0;
      default:
        return 0;
    }
  }

  // 실시간 데이터 시뮬레이션
  static generateRealtimeData() {
    return {
      airQuality: {
        pm25: Math.floor(Math.random() * 100),
        pm10: Math.floor(Math.random() * 150),
        status: Math.random() > 0.7 ? 'good' : Math.random() > 0.4 ? 'moderate' : 'poor'
      },
      temperature: {
        current: Math.floor(Math.random() * 35) - 5,
        feels_like: Math.floor(Math.random() * 40) - 5,
        heat_index: Math.floor(Math.random() * 10)
      },
      weather: {
        condition: ['sunny', 'cloudy', 'rainy', 'snow'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 100),
        wind_speed: Math.floor(Math.random() * 20)
      },
      energy: {
        solar_generation: Math.floor(Math.random() * 1000),
        grid_demand: Math.floor(Math.random() * 2000) + 1000,
        efficiency: Math.floor(Math.random() * 30) + 70
      }
    };
  }
}

// 색상 맵핑 유틸리티
export const getColorForValue = (value: number, min: number, max: number, colorScale: string[] = ['#00ff00', '#ffff00', '#ff0000']) => {
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
  
  if (normalized <= 0.5) {
    return interpolateColor(colorScale[0], colorScale[1], normalized * 2);
  } else {
    return interpolateColor(colorScale[1], colorScale[2], (normalized - 0.5) * 2);
  }
};

const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
  
  return rgbToHex(r, g, b);
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};