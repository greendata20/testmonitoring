// 테스트용 장애인 데이터 생성기
import type { DisabilityRecord, ParsedData } from './excelParser';

export function generateTestDisabilityData(): ParsedData {
  const regions = [
    '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
    '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원특별자치도',
    '충청북도', '충청남도', '전북특별자치도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
  ];

  const disabilityTypes = [
    '지체장애', '뇌병변장애', '시각장애', '청각장애', '언어장애',
    '지적장애', '자폐성장애', '정신장애', '신장장애', '심장장애',
    '호흡기장애', '간장애', '안면장애', '장루요루장애', '뇌전증장애'
  ];

  const genders = ['남성', '여성'] as const;

  const records: DisabilityRecord[] = [];
  let idCounter = 0;

  // 각 지역, 성별, 장애유형에 대해 데이터 생성
  regions.forEach(region => {
    genders.forEach(gender => {
      disabilityTypes.forEach(disabilityType => {
        // 랜덤한 장애인 수 생성 (실제적인 분포 고려)
        let baseCount = 0;
        switch (disabilityType) {
          case '지체장애':
            baseCount = Math.floor(Math.random() * 50000) + 10000;
            break;
          case '시각장애':
          case '청각장애':
            baseCount = Math.floor(Math.random() * 20000) + 5000;
            break;
          case '지적장애':
          case '뇌병변장애':
            baseCount = Math.floor(Math.random() * 15000) + 3000;
            break;
          case '정신장애':
            baseCount = Math.floor(Math.random() * 25000) + 5000;
            break;
          default:
            baseCount = Math.floor(Math.random() * 10000) + 1000;
        }

        // 지역 규모에 따른 조정
        let regionMultiplier = 1;
        if (['서울특별시', '경기도'].includes(region)) {
          regionMultiplier = 1.5;
        } else if (['부산광역시', '대구광역시', '인천광역시'].includes(region)) {
          regionMultiplier = 0.8;
        } else if (['세종특별자치시', '제주특별자치도'].includes(region)) {
          regionMultiplier = 0.3;
        }

        const finalCount = Math.floor(baseCount * regionMultiplier);

        if (finalCount > 0) {
          const record: DisabilityRecord = {
            id: `test_${idCounter++}`,
            region,
            gender,
            disabilityType,
            count: finalCount,
            year: 2024
          };
          records.push(record);
        }
      });
    });
  });

  // 전체 통계 계산
  const totalCount = records.reduce((sum, record) => sum + record.count, 0);
  const regionStats = regions.map(region => region);
  const disabilityTypeStats = disabilityTypes;
  const genderStats = ['남성', '여성'];

  return {
    records,
    summary: {
      totalRecords: records.length,
      regions: regionStats,
      disabilityTypes: disabilityTypeStats,
      genders: genderStats,
      totalCount
    }
  };
}