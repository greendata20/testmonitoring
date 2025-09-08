import * as XLSX from 'xlsx';

export interface DisabilityRecord {
  id: string;
  region: string;         // 지역 (시도/시군구)
  regionCode?: string;    // 지역 코드
  gender: '남성' | '여성' | '전체';
  disabilityType: string; // 장애 유형
  count: number;          // 장애인 수
  year?: number;          // 연도
  month?: number;         // 월
}

export interface ParsedData {
  records: DisabilityRecord[];
  summary: {
    totalRecords: number;
    regions: string[];
    disabilityTypes: string[];
    genders: string[];
    totalCount: number;
  };
}

// 엑셀 파일을 읽어서 JSON으로 변환
export async function parseExcelFile(fileName: string): Promise<ParsedData> {
  try {
    const response = await fetch(`/data/${fileName}`);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // 첫 번째 시트 읽기
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 시트를 JSON으로 변환
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    return parseKoreanDisabilityData(jsonData as any[][], fileName);
  } catch (error) {
    console.error('Excel 파일 파싱 중 오류 발생:', error);
    throw new Error(`파일 파싱 실패: ${fileName}`);
  }
}

// 한국어 장애인 데이터 파싱 로직
function parseKoreanDisabilityData(data: any[][], fileName: string): ParsedData {
  const records: DisabilityRecord[] = [];
  let headerRowIndex = -1;
  
  console.log(`전체 시트 데이터 크기: ${data.length}행`);
  console.log('첫 3개 행 전체 데이터:');
  for (let i = 0; i < Math.min(3, data.length); i++) {
    console.log(`행 ${i}:`, data[i]);
  }
  
  // 특별한 로직: database.xlsx의 경우 두 번째 행(index 1)이 실제 헤더
  // ['시군구별', '장애유형별', '전체', '여자', '남자'] 형태
  if (data.length > 1 && data[1] && data[1].includes('여자') && data[1].includes('남자')) {
    headerRowIndex = 1;
    console.log('✅ 실제 헤더 행 발견: 1번째 행 (여자/남자 포함)');
  } else {
    // 기존 헤더 검색 로직 (fallback)
    for (let i = 0; i < Math.min(15, data.length); i++) {
      const row = data[i];
      if (row && Array.isArray(row) && row.length > 1) {
        const rowStr = row.join(' ').toLowerCase();
        console.log(`행 ${i}:`, row.slice(0, 5));
        
        if (rowStr.includes('여자') || rowStr.includes('남자') || rowStr.includes('여성') || rowStr.includes('남성') ||
            (rowStr.includes('지역') || rowStr.includes('시도') || rowStr.includes('구분') || 
             rowStr.includes('성별') || rowStr.includes('장애') || rowStr.includes('전체') ||
             rowStr.includes('남') || rowStr.includes('여') || rowStr.includes('계'))) {
          headerRowIndex = i;
          console.log(`헤더 행 발견: ${i}번째 행`);
          break;
        }
      }
    }
    
    // 헤더를 찾을 수 없으면 첫 번째 행을 헤더로 사용
    if (headerRowIndex === -1) {
      headerRowIndex = 0;
      console.log('헤더를 찾을 수 없어서 첫 번째 행을 헤더로 사용');
    }
  }
  
  const headers = data[headerRowIndex] || [];
  console.log('=== EXCEL 파일 분석 상세 정보 ===');
  console.log('최종 헤더 (전체):', headers);
  console.log('헤더 개수:', headers.length);
  console.log('각 헤더별 상세:');
  headers.forEach((header, index) => {
    if (header && String(header).trim()) {
      console.log(`  [${index}] "${header}" - 타입: ${typeof header}`);
    }
  });
  
  // 데이터 행 처리 (database.xlsx 전용 로직)
  let processedRows = 0;
  for (let i = headerRowIndex + 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !Array.isArray(row) || row.length < 5) continue;
    
    // 지역과 장애유형 추출
    let region = String(row[0] || '').trim();
    let disabilityType = String(row[1] || '').trim();
    
    // 빈 지역은 이전 지역을 사용 (병합된 셀 처리)
    if (!region && i > headerRowIndex + 1) {
      // 이전 행들에서 지역 찾기
      for (let j = i - 1; j > headerRowIndex; j--) {
        const prevRow = data[j];
        if (prevRow && prevRow[0] && String(prevRow[0]).trim()) {
          region = String(prevRow[0]).trim();
          break;
        }
      }
    }
    
    // 건너뛸 조건들
    if (!region || !disabilityType ||
        region.includes('소계') || region.includes('합계') || 
        disabilityType.includes('소계') || disabilityType.includes('합계') ||
        disabilityType === '총계' || region === '전국') {
      continue;
    }
    
    // 지역명에서 숫자 제거
    region = region.replace(/^\d+\s*/, '');
    
    console.log(`📍 처리 중: ${region} - ${disabilityType}`);
    
    // 전체, 여자, 남자 데이터 추출
    const totalCount = parseNumber(row[2]);
    const femaleCount = parseNumber(row[3]);
    const maleCount = parseNumber(row[4]);
    
    // 전체 레코드
    if (totalCount && totalCount > 0) {
      const record: DisabilityRecord = {
        id: `${region}_전체_${disabilityType}_${i}`,
        region,
        gender: '전체',
        disabilityType,
        count: totalCount,
        year: extractYearFromFileName(fileName) || 2024,
      };
      records.push(record);
    }
    
    // 여자 레코드
    if (femaleCount && femaleCount > 0) {
      const record: DisabilityRecord = {
        id: `${region}_여성_${disabilityType}_${i}`,
        region,
        gender: '여성',
        disabilityType,
        count: femaleCount,
        year: extractYearFromFileName(fileName) || 2024,
      };
      records.push(record);
    }
    
    // 남자 레코드
    if (maleCount && maleCount > 0) {
      const record: DisabilityRecord = {
        id: `${region}_남성_${disabilityType}_${i}`,
        region,
        gender: '남성',
        disabilityType,
        count: maleCount,
        year: extractYearFromFileName(fileName) || 2024,
      };
      records.push(record);
    }
    
    processedRows++;
    
    // 처리 제한
    if (processedRows >= 200) break;
  }
  
  console.log(`총 ${processedRows}개 행에서 ${records.length}개 레코드 생성`);
  
  // 요약 정보 생성
  const regions = [...new Set(records.map(r => r.region))];
  const disabilityTypes = [...new Set(records.map(r => r.disabilityType))];
  const genders = [...new Set(records.map(r => r.gender))];
  const totalCount = records.reduce((sum, r) => sum + r.count, 0);
  
  console.log('파싱 결과 요약:');
  console.log(`- 총 레코드: ${records.length}개`);
  console.log(`- 지역 수: ${regions.length}개`);
  console.log(`- 장애유형 수: ${disabilityTypes.length}개`);
  console.log(`- 성별 수: ${genders.length}개`);
  console.log(`- 총 인원: ${totalCount}명`);
  
  return {
    records,
    summary: {
      totalRecords: records.length,
      regions,
      disabilityTypes,
      genders,
      totalCount
    }
  };
}

// 사용하지 않는 함수 제거됨

// 사용하지 않는 함수들 제거됨

// 구체적인 장애유형 추출
function extractSpecificDisabilityType(header: string): string | null {
  const specificTypes = [
    '지체장애', '뇌병변장애', '시각장애', '청각장애', '언어장애',
    '지적장애', '자폐성장애', '정신장애', '신장장애', '심장장애',
    '호흡기장애', '간장애', '안면장애', '장루요루장애', '뇌전증장애',
    '중복장애', '지체', '뇌병변', '시각', '청각', '언어', '지적', '자폐성', '정신', '신장', '심장', '호흡기', '간', '안면', '장루', '뇌전증'
  ];
  
  for (const type of specificTypes) {
    if (header.includes(type)) {
      // 축약형을 전체 이름으로 변환
      switch (type) {
        case '지체': return '지체장애';
        case '뇌병변': return '뇌병변장애';
        case '시각': return '시각장애';
        case '청각': return '청각장애';
        case '언어': return '언어장애';
        case '지적': return '지적장애';
        case '자폐성': return '자폐성장애';
        case '정신': return '정신장애';
        case '신장': return '신장장애';
        case '심장': return '심장장애';
        case '호흡기': return '호흡기장애';
        case '간': return '간장애';
        case '안면': return '안면장애';
        case '장루': return '장루요루장애';
        case '뇌전증': return '뇌전증장애';
        default: return type;
      }
    }
  }
  
  return null;
}

// 유틸리티 함수들
function cleanText(text: string): string {
  return text.replace(/[\r\n\t]/g, ' ').trim();
}

function parseNumber(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  
  const num = Number(String(value).replace(/[,\s]/g, ''));
  return isNaN(num) ? null : num;
}

function extractYearFromFileName(fileName: string): number | undefined {
  const match = fileName.match(/202[0-9]/);
  return match ? parseInt(match[0]) : undefined;
}

// database.xlsx 파일 파싱
export async function parseAllDisabilityFiles(): Promise<ParsedData> {
  const fileName = 'database.xlsx';
  
  try {
    console.log(`database.xlsx 파일 파싱 중...`);
    const data = await parseExcelFile(fileName);
    
    console.log(`database.xlsx 파싱 완료: ${data.records.length}개 레코드`);
    console.log('지역 목록:', data.summary.regions);
    console.log('성별 목록:', data.summary.genders);
    console.log('장애유형 목록:', data.summary.disabilityTypes);
    
    return data;
  } catch (error) {
    console.error(`database.xlsx 파싱 실패:`, error);
    throw error;
  }
}