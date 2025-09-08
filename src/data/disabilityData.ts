// 대한민국 시도별 장애인 현황 데이터 (2023년 기준)
export interface DisabilityStats {
  region: string;
  regionCode: string;
  totalPopulation: number;
  disabledPopulation: number;
  disabilityRate: number;
  byType: {
    physical: number;
    visual: number;
    hearing: number;
    speech: number;
    intellectual: number;
    mental: number;
    others: number;
  };
  byGrade: {
    severe: number;
    mild: number;
  };
  coordinates: [number, number]; // [lat, lng]
}

export const disabilityData: DisabilityStats[] = [
  {
    region: '서울특별시',
    regionCode: '11',
    totalPopulation: 9720846,
    disabledPopulation: 394982,
    disabilityRate: 4.06,
    byType: {
      physical: 205834,
      visual: 29847,
      hearing: 35621,
      speech: 4892,
      intellectual: 37429,
      mental: 61847,
      others: 19512
    },
    byGrade: {
      severe: 118495,
      mild: 276487
    },
    coordinates: [37.5665, 126.9780]
  },
  {
    region: '부산광역시',
    regionCode: '26',
    totalPopulation: 3349016,
    disabledPopulation: 174298,
    disabilityRate: 5.20,
    byType: {
      physical: 97842,
      visual: 12451,
      hearing: 15234,
      speech: 1987,
      intellectual: 14523,
      mental: 25641,
      others: 6620
    },
    byGrade: {
      severe: 52289,
      mild: 122009
    },
    coordinates: [35.1796, 129.0756]
  },
  {
    region: '대구광역시',
    regionCode: '27',
    totalPopulation: 2410700,
    disabledPopulation: 131847,
    disabilityRate: 5.47,
    byType: {
      physical: 75623,
      visual: 9234,
      hearing: 11567,
      speech: 1456,
      intellectual: 11234,
      mental: 18945,
      others: 3788
    },
    byGrade: {
      severe: 39554,
      mild: 92293
    },
    coordinates: [35.8714, 128.6014]
  },
  {
    region: '인천광역시',
    regionCode: '28',
    totalPopulation: 2947217,
    disabledPopulation: 146789,
    disabilityRate: 4.98,
    byType: {
      physical: 82134,
      visual: 11234,
      hearing: 13456,
      speech: 1789,
      intellectual: 13567,
      mental: 20987,
      others: 3622
    },
    byGrade: {
      severe: 44037,
      mild: 102752
    },
    coordinates: [37.4563, 126.7052]
  },
  {
    region: '광주광역시',
    regionCode: '29',
    totalPopulation: 1441970,
    disabledPopulation: 78234,
    disabilityRate: 5.42,
    byType: {
      physical: 45623,
      visual: 6234,
      hearing: 7456,
      speech: 987,
      intellectual: 7123,
      mental: 9456,
      others: 1355
    },
    byGrade: {
      severe: 23470,
      mild: 54764
    },
    coordinates: [35.1595, 126.8526]
  },
  {
    region: '대전광역시',
    regionCode: '30',
    totalPopulation: 1454679,
    disabledPopulation: 72345,
    disabilityRate: 4.97,
    byType: {
      physical: 42134,
      visual: 5789,
      hearing: 6987,
      speech: 945,
      intellectual: 6734,
      mental: 8567,
      others: 1189
    },
    byGrade: {
      severe: 21704,
      mild: 50641
    },
    coordinates: [36.3504, 127.3845]
  },
  {
    region: '울산광역시',
    regionCode: '31',
    totalPopulation: 1124459,
    disabledPopulation: 54678,
    disabilityRate: 4.86,
    byType: {
      physical: 31234,
      visual: 4567,
      hearing: 5234,
      speech: 678,
      intellectual: 4987,
      mental: 6789,
      others: 1189
    },
    byGrade: {
      severe: 16403,
      mild: 38275
    },
    coordinates: [35.5384, 129.3114]
  },
  {
    region: '세종특별자치시',
    regionCode: '36',
    totalPopulation: 365309,
    disabledPopulation: 15234,
    disabilityRate: 4.17,
    byType: {
      physical: 8567,
      visual: 1234,
      hearing: 1456,
      speech: 234,
      intellectual: 1345,
      mental: 2123,
      others: 275
    },
    byGrade: {
      severe: 4570,
      mild: 10664
    },
    coordinates: [36.4800, 127.2890]
  },
  {
    region: '경기도',
    regionCode: '41',
    totalPopulation: 13565019,
    disabledPopulation: 567890,
    disabilityRate: 4.19,
    byType: {
      physical: 312456,
      visual: 42345,
      hearing: 51234,
      speech: 6789,
      intellectual: 52345,
      mental: 84567,
      others: 18154
    },
    byGrade: {
      severe: 170367,
      mild: 397523
    },
    coordinates: [37.4138, 127.5183]
  },
  {
    region: '강원특별자치도',
    regionCode: '42',
    totalPopulation: 1533051,
    disabledPopulation: 89456,
    disabilityRate: 5.84,
    byType: {
      physical: 54123,
      visual: 6789,
      hearing: 8234,
      speech: 1123,
      intellectual: 6987,
      mental: 10456,
      others: 1744
    },
    byGrade: {
      severe: 26837,
      mild: 62619
    },
    coordinates: [37.8228, 128.1555]
  },
  {
    region: '충청북도',
    regionCode: '43',
    totalPopulation: 1591625,
    disabledPopulation: 91234,
    disabilityRate: 5.73,
    byType: {
      physical: 54678,
      visual: 6987,
      hearing: 8456,
      speech: 1234,
      intellectual: 7123,
      mental: 11234,
      others: 1522
    },
    byGrade: {
      severe: 27370,
      mild: 63864
    },
    coordinates: [36.8, 127.7]
  },
  {
    region: '충청남도',
    regionCode: '44',
    totalPopulation: 2116762,
    disabledPopulation: 123456,
    disabilityRate: 5.83,
    byType: {
      physical: 74567,
      visual: 9234,
      hearing: 11123,
      speech: 1567,
      intellectual: 9678,
      mental: 15234,
      others: 2053
    },
    byGrade: {
      severe: 37037,
      mild: 86419
    },
    coordinates: [36.5184, 126.8]
  },
  {
    region: '전북특별자치도',
    regionCode: '45',
    totalPopulation: 1777319,
    disabledPopulation: 116789,
    disabilityRate: 6.57,
    byType: {
      physical: 71234,
      visual: 8976,
      hearing: 10567,
      speech: 1456,
      intellectual: 8934,
      mental: 13789,
      others: 1833
    },
    byGrade: {
      severe: 35037,
      mild: 81752
    },
    coordinates: [35.7175, 127.153]
  },
  {
    region: '전라남도',
    regionCode: '46',
    totalPopulation: 1780579,
    disabledPopulation: 123678,
    disabilityRate: 6.95,
    byType: {
      physical: 78456,
      visual: 9567,
      hearing: 11234,
      speech: 1567,
      intellectual: 8789,
      mental: 12345,
      others: 1720
    },
    byGrade: {
      severe: 37103,
      mild: 86575
    },
    coordinates: [34.8679, 126.991]
  },
  {
    region: '경상북도',
    regionCode: '47',
    totalPopulation: 2619788,
    disabledPopulation: 175432,
    disabilityRate: 6.70,
    byType: {
      physical: 107890,
      visual: 13456,
      hearing: 16234,
      speech: 2123,
      intellectual: 12567,
      mental: 20234,
      others: 2928
    },
    byGrade: {
      severe: 52630,
      mild: 122802
    },
    coordinates: [36.4919, 128.8889]
  },
  {
    region: '경상남도',
    regionCode: '48',
    totalPopulation: 3312319,
    disabledPopulation: 195678,
    disabilityRate: 5.91,
    byType: {
      physical: 118765,
      visual: 14567,
      hearing: 17890,
      speech: 2456,
      intellectual: 15234,
      mental: 24123,
      others: 2643
    },
    byGrade: {
      severe: 58703,
      mild: 136975
    },
    coordinates: [35.4606, 128.2132]
  },
  {
    region: '제주특별자치도',
    regionCode: '50',
    totalPopulation: 676361,
    disabledPopulation: 34567,
    disabilityRate: 5.11,
    byType: {
      physical: 20123,
      visual: 2789,
      hearing: 3234,
      speech: 456,
      intellectual: 2987,
      mental: 4567,
      others: 411
    },
    byGrade: {
      severe: 10370,
      mild: 24197
    },
    coordinates: [33.4996, 126.5312]
  }
];

// 전국 통계 계산
export const nationalStats = {
  totalPopulation: disabilityData.reduce((sum, region) => sum + region.totalPopulation, 0),
  totalDisabled: disabilityData.reduce((sum, region) => sum + region.disabledPopulation, 0),
  averageDisabilityRate: disabilityData.reduce((sum, region) => sum + region.disabilityRate, 0) / disabilityData.length,
  totalByType: disabilityData.reduce((acc, region) => ({
    physical: acc.physical + region.byType.physical,
    visual: acc.visual + region.byType.visual,
    hearing: acc.hearing + region.byType.hearing,
    speech: acc.speech + region.byType.speech,
    intellectual: acc.intellectual + region.byType.intellectual,
    mental: acc.mental + region.byType.mental,
    others: acc.others + region.byType.others
  }), {
    physical: 0,
    visual: 0,
    hearing: 0,
    speech: 0,
    intellectual: 0,
    mental: 0,
    others: 0
  })
};

export const disabilityTypeLabels = {
  physical: '지체장애',
  visual: '시각장애',
  hearing: '청각장애',
  speech: '언어장애',
  intellectual: '지적장애',
  mental: '정신장애',
  others: '기타장애'
};