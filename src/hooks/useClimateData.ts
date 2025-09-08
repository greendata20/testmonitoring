import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { DataProcessor, parseCSV, parseThermalComfortData, parseClimateVulnerableData, parseSolarPowerData } from '../utils/dataProcessor';
import type { ThermalComfortData, ClimateVulnerablePopulation, SolarPowerData } from '../types';

interface ClimateDataState {
  thermalComfort: ThermalComfortData[];
  vulnerablePopulation: ClimateVulnerablePopulation[];
  solarPower: SolarPowerData[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useClimateData = () => {
  const { setLoading } = useAppStore();
  const [state, setState] = useState<ClimateDataState>({
    thermalComfort: [],
    vulnerablePopulation: [],
    solarPower: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  // 샘플 데이터 생성 (실제 환경에서는 API 호출로 교체)
  const generateSampleData = useCallback((): ClimateDataState['thermalComfort'] => {
    const regions = [
      { code: '31010', name: '중구', base_temp: 25.5 },
      { code: '31020', name: '동구', base_temp: 24.8 },
      { code: '31030', name: '서구', base_temp: 24.2 },
      { code: '31040', name: '남구', base_temp: 25.1 },
      { code: '31050', name: '북구', base_temp: 24.6 },
      { code: '31060', name: '수성구', base_temp: 25.3 },
      { code: '31070', name: '달서구', base_temp: 25.8 },
      { code: '31080', name: '달성군', base_temp: 23.9 },
    ];

    return regions.map(region => {
      // 온도에 따른 열쾌적 등급별 인구 분포 시뮬레이션
      const totalPop = Math.floor(Math.random() * 500000) + 100000;
      const tempFactor = (region.base_temp - 20) / 15; // 정규화된 온도 요소
      
      // 온도가 높을수록 고등급(불편함)에 더 많은 인구 분포
      const gradeWeights = Array.from({ length: 10 }, (_, i) => {
        const grade = i + 1;
        if (tempFactor > 0.6) {
          // 고온 지역: 7-10등급에 더 많은 분포
          return grade > 6 ? Math.random() * 0.3 + 0.1 : Math.random() * 0.1;
        } else if (tempFactor < 0.3) {
          // 저온 지역: 1-4등급에 더 많은 분포
          return grade < 5 ? Math.random() * 0.3 + 0.1 : Math.random() * 0.1;
        } else {
          // 보통 지역: 중간 등급에 집중
          return grade > 3 && grade < 8 ? Math.random() * 0.2 + 0.15 : Math.random() * 0.05;
        }
      });

      const totalWeight = gradeWeights.reduce((sum, weight) => sum + weight, 0);
      const normalizedWeights = gradeWeights.map(weight => weight / totalWeight);

      return {
        sigun_cd: region.code,
        sigun_nm: region.name,
        thrcf_grd1_livng_ppltn_cnt: Math.floor(totalPop * normalizedWeights[0]),
        thrcf_grd2_livng_ppltn_cnt: Math.floor(totalPop * normalizedWeights[1]),
        thrcf_grd3_livng_ppltn_cnt: Math.floor(totalPop * normalizedWeights[2]),
        thrcf_grd4_livng_ppltn_cnt: Math.floor(totalPop * normalizedWeights[3]),
        thrcf_grd5_livng_ppltn_cnt: Math.floor(totalPop * normalizedWeights[4]),
        thrcf_grd6_livng_ppltn_cnt: Math.floor(totalPop * normalizedWeights[5]),
        thrcf_grd7_livng_ppltn_cnt: Math.floor(totalPop * normalizedWeights[6]),
        thrcf_grd8_livng_ppltn_cnt: Math.floor(totalPop * normalizedWeights[7]),
        thrcf_grd9_livng_ppltn_cnt: Math.floor(totalPop * normalizedWeights[8]),
        thrcf_grd10_livng_ppltn_cnt: Math.floor(totalPop * normalizedWeights[9]),
        whol_livng_ppltn_cnt: totalPop,
      };
    });
  }, []);

  const generateVulnerablePopulationData = useCallback((): ClimateVulnerablePopulation[] => {
    const regions = [
      { code: '31010', name: '중구' },
      { code: '31020', name: '동구' },
      { code: '31030', name: '서구' },
      { code: '31040', name: '남구' },
      { code: '31050', name: '북구' },
      { code: '31060', name: '수성구' },
      { code: '31070', name: '달서구' },
      { code: '31080', name: '달성군' },
    ];

    return regions.map((region, index) => {
      const totalPop = Math.floor(Math.random() * 800000) + 200000;
      const vulnerabilityFactor = Math.random();
      
      return {
        objectid: index + 1,
        sigun_cd: region.code,
        sigun_nm: region.name,
        sigun_ppltn_cnt: totalPop,
        age5udr_ppltn_cnt: Math.floor(totalPop * 0.05 * (1 + vulnerabilityFactor)),
        snctz_ppltn_cnt: Math.floor(totalPop * 0.15 * (1 + vulnerabilityFactor)),
        pwdbs_ppltn_cnt: Math.floor(totalPop * 0.05 * (1 + vulnerabilityFactor)),
        hril_ppltn_cnt: Math.floor(totalPop * 0.001 * (1 + vulnerabilityFactor * 2)),
        chds_ppltn_cnt: Math.floor(totalPop * 0.003 * (1 + vulnerabilityFactor * 1.5)),
        clim_vul_snths_scr: Math.floor(vulnerabilityFactor * 60 + 20),
        hlth_vul_scr: Math.floor(vulnerabilityFactor * 70 + 15),
        ecny_vul_scr: Math.floor(vulnerabilityFactor * 65 + 25),
      };
    });
  }, []);

  const generateSolarPowerData = useCallback((): SolarPowerData[] => {
    const regions = [
      { code: '3101010001', name: '중구1동' },
      { code: '3101010002', name: '중구2동' },
      { code: '3102010001', name: '동구1동' },
      { code: '3102010002', name: '동구2동' },
      { code: '3103010001', name: '서구1동' },
      { code: '3103010002', name: '서구2동' },
      { code: '3104010001', name: '남구1동' },
      { code: '3104010002', name: '남구2동' },
    ];

    return regions.map(region => {
      const efficiency = Math.random() * 0.3 + 0.7; // 0.7-1.0 효율성
      const baseArea = Math.floor(Math.random() * 20000) + 5000;
      
      return {
        stdg_cd: region.code,
        stdg_nm: region.name,
        sgg_cd: region.code.substring(0, 5),
        sgg_nm: region.name.replace(/\d+동$/, ''),
        sigun_cd: region.code.substring(0, 3) + '00',
        sigun_nm: region.name.replace(/\d+동$/, '').replace(/구$/, '') + '구',
        sum_genqy: baseArea * efficiency * 1.5, // kWh 발전량
        sum_area: baseArea,
      };
    });
  }, []);

  // 데이터 로드
  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    setLoading(true);

    try {
      // 실제 환경에서는 여기서 CSV 파일을 로드하거나 API를 호출
      await new Promise(resolve => setTimeout(resolve, 1500)); // 로딩 시뮬레이션

      const thermalData = generateSampleData();
      const vulnerableData = generateVulnerablePopulationData();
      const solarData = generateSolarPowerData();

      setState({
        thermalComfort: thermalData,
        vulnerablePopulation: vulnerableData,
        solarPower: solarData,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Data loading failed'
      }));
    } finally {
      setLoading(false);
    }
  }, [generateSampleData, generateVulnerablePopulationData, generateSolarPowerData, setLoading]);

  // 실제 CSV 파일 로드 (옵션)
  const loadFromCSV = useCallback(async (csvPath: string, dataType: 'thermal' | 'vulnerable' | 'solar') => {
    try {
      const response = await fetch(csvPath);
      const csvText = await response.text();
      
      let parsedData: any;
      switch (dataType) {
        case 'thermal':
          parsedData = parseCSV(csvText, parseThermalComfortData);
          setState(prev => ({ ...prev, thermalComfort: parsedData }));
          break;
        case 'vulnerable':
          parsedData = parseCSV(csvText, parseClimateVulnerableData);
          setState(prev => ({ ...prev, vulnerablePopulation: parsedData }));
          break;
        case 'solar':
          parsedData = parseCSV(csvText, parseSolarPowerData);
          setState(prev => ({ ...prev, solarPower: parsedData }));
          break;
      }
      
    } catch (error) {
      console.error(`Error loading ${dataType} data:`, error);
    }
  }, []);

  // 통계 계산
  const getStatistics = useCallback(() => {
    if (!state.thermalComfort.length || !state.vulnerablePopulation.length || !state.solarPower.length) {
      return null;
    }

    return {
      thermal: DataProcessor.calculateThermalComfortStats(state.thermalComfort),
      vulnerable: DataProcessor.calculateVulnerabilityStats(state.vulnerablePopulation),
      solar: DataProcessor.calculateSolarPotential(state.solarPower),
    };
  }, [state]);

  // 실시간 데이터 업데이트
  const [realtimeData, setRealtimeData] = useState(DataProcessor.generateRealtimeData());

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(DataProcessor.generateRealtimeData());
    }, 30000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...state,
    statistics: getStatistics(),
    realtimeData,
    loadData,
    loadFromCSV,
    DataProcessor,
  };
};