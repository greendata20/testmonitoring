import { create } from 'zustand';
import type { DisabilityRecord, ParsedData } from '../utils/excelParser';
import { parseAllDisabilityFiles } from '../utils/excelParser';
import { generateTestDisabilityData } from '../utils/testDataGenerator';

export interface DisabilityFilters {
  region?: string;
  gender?: string;
  disabilityType?: string;
  yearRange?: [number, number];
  searchText?: string;
}

export interface DisabilityStats {
  totalCount: number;
  regionStats: Array<{ region: string; count: number; percentage: number }>;
  genderStats: Array<{ gender: string; count: number; percentage: number }>;
  typeStats: Array<{ type: string; count: number; percentage: number }>;
  topRegions: Array<{ region: string; count: number }>;
  yearlyTrend?: Array<{ year: number; count: number }>;
}

interface DisabilityStore {
  // 데이터 상태
  rawData: ParsedData | null;
  filteredRecords: DisabilityRecord[];
  isLoading: boolean;
  error: string | null;
  
  // 필터 상태
  filters: DisabilityFilters;
  
  // 통계 상태
  stats: DisabilityStats | null;
  
  // 액션
  loadData: () => Promise<void>;
  setFilters: (filters: Partial<DisabilityFilters>) => void;
  clearFilters: () => void;
  refreshStats: () => void;
  searchRecords: (query: string) => DisabilityRecord[];
}

export const useDisabilityStore = create<DisabilityStore>((set, get) => ({
  // 초기 상태
  rawData: null,
  filteredRecords: [],
  isLoading: false,
  error: null,
  filters: {},
  stats: null,

  // 데이터 로드
  loadData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Excel 파일 파싱 시도 중...');
      const data = await parseAllDisabilityFiles();
      
      // 데이터가 충분하지 않으면 테스트 데이터 사용
      if (!data.records || data.records.length < 10) {
        console.log('Excel 데이터가 부족합니다. 테스트 데이터를 사용합니다.');
        const testData = generateTestDisabilityData();
        set({ 
          rawData: testData, 
          filteredRecords: testData.records,
          isLoading: false 
        });
      } else {
        console.log(`Excel 데이터 로드 완료: ${data.records.length}개 레코드`);
        set({ 
          rawData: data, 
          filteredRecords: data.records,
          isLoading: false 
        });
      }
      
      // 통계 계산
      get().refreshStats();
    } catch (error) {
      console.error('Excel 파싱 실패, 테스트 데이터 사용:', error);
      // Excel 파싱 실패 시 테스트 데이터 사용
      const testData = generateTestDisabilityData();
      set({ 
        rawData: testData, 
        filteredRecords: testData.records,
        isLoading: false,
        error: 'Excel 파일 로드 실패 - 테스트 데이터를 표시합니다'
      });
      
      // 통계 계산
      get().refreshStats();
    }
  },

  // 필터 설정
  setFilters: (newFilters: Partial<DisabilityFilters>) => {
    const { rawData } = get();
    if (!rawData) return;

    const filters = { ...get().filters, ...newFilters };
    let filteredRecords = rawData.records;

    // 지역 필터
    if (filters.region && filters.region !== '전체') {
      filteredRecords = filteredRecords.filter(record => 
        record.region.includes(filters.region!)
      );
    }

    // 성별 필터
    if (filters.gender && filters.gender !== '전체') {
      filteredRecords = filteredRecords.filter(record => 
        record.gender === filters.gender
      );
    }

    // 장애유형 필터
    if (filters.disabilityType && filters.disabilityType !== '전체') {
      filteredRecords = filteredRecords.filter(record => 
        record.disabilityType.includes(filters.disabilityType!)
      );
    }

    // 연도 필터
    if (filters.yearRange) {
      const [startYear, endYear] = filters.yearRange;
      filteredRecords = filteredRecords.filter(record => 
        record.year && record.year >= startYear && record.year <= endYear
      );
    }

    // 텍스트 검색
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filteredRecords = filteredRecords.filter(record => 
        record.region.toLowerCase().includes(searchLower) ||
        record.disabilityType.toLowerCase().includes(searchLower)
      );
    }

    set({ filters, filteredRecords });
    get().refreshStats();
  },

  // 필터 초기화
  clearFilters: () => {
    const { rawData } = get();
    if (!rawData) return;

    set({ 
      filters: {},
      filteredRecords: rawData.records 
    });
    get().refreshStats();
  },

  // 통계 새로고침
  refreshStats: () => {
    const { filteredRecords } = get();
    if (filteredRecords.length === 0) {
      set({ stats: null });
      return;
    }

    // 총 인원은 남성과 여성 레코드만 합계 (전체 레코드 제외하여 중복 계산 방지)
    const totalCount = filteredRecords
      .filter(record => record.gender === '남성' || record.gender === '여성')
      .reduce((sum, record) => sum + record.count, 0);

    // 지역별 통계 (남성/여성 레코드만 사용하여 중복 계산 방지)
    const regionMap = new Map<string, number>();
    filteredRecords
      .filter(record => record.gender === '남성' || record.gender === '여성')
      .forEach(record => {
        regionMap.set(record.region, (regionMap.get(record.region) || 0) + record.count);
      });
    const regionStats = Array.from(regionMap.entries())
      .map(([region, count]) => ({
        region,
        count,
        percentage: (count / totalCount) * 100
      }))
      .sort((a, b) => b.count - a.count);

    // 성별 통계
    const genderMap = new Map<string, number>();
    filteredRecords.forEach(record => {
      genderMap.set(record.gender, (genderMap.get(record.gender) || 0) + record.count);
    });
    const genderStats = Array.from(genderMap.entries())
      .map(([gender, count]) => ({
        gender,
        count,
        percentage: (count / totalCount) * 100
      }))
      .sort((a, b) => b.count - a.count);

    // 장애유형별 통계 (남성/여성 레코드만 사용하여 중복 계산 방지)
    const typeMap = new Map<string, number>();
    filteredRecords
      .filter(record => record.gender === '남성' || record.gender === '여성')
      .forEach(record => {
        typeMap.set(record.disabilityType, (typeMap.get(record.disabilityType) || 0) + record.count);
      });
    const typeStats = Array.from(typeMap.entries())
      .map(([type, count]) => ({
        type,
        count,
        percentage: (count / totalCount) * 100
      }))
      .sort((a, b) => b.count - a.count);

    // 상위 지역
    const topRegions = regionStats.slice(0, 10);

    // 연도별 추세 (남성/여성 레코드만 사용하여 중복 계산 방지)
    const yearMap = new Map<number, number>();
    filteredRecords
      .filter(record => record.gender === '남성' || record.gender === '여성')
      .forEach(record => {
        if (record.year) {
          yearMap.set(record.year, (yearMap.get(record.year) || 0) + record.count);
        }
      });
    const yearlyTrend = yearMap.size > 0 
      ? Array.from(yearMap.entries())
          .map(([year, count]) => ({ year, count }))
          .sort((a, b) => a.year - b.year)
      : undefined;

    const stats: DisabilityStats = {
      totalCount,
      regionStats,
      genderStats,
      typeStats,
      topRegions,
      yearlyTrend
    };

    set({ stats });
  },

  // 검색
  searchRecords: (query: string) => {
    const { rawData } = get();
    if (!rawData || !query.trim()) return [];

    const searchLower = query.toLowerCase();
    return rawData.records.filter(record => 
      record.region.toLowerCase().includes(searchLower) ||
      record.disabilityType.toLowerCase().includes(searchLower) ||
      record.gender.toLowerCase().includes(searchLower)
    ).slice(0, 100); // 성능을 위해 결과 제한
  }
}));