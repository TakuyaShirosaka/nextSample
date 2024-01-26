// マスタデータを純粋に型定義した物
export interface Store {
    store_id: number;
    store_name: string;
    phone_number: string;
    address: string;
    businessHours_start: string;
    businessHours_end: string;
    lineURLScheme: string;
    notices: string;
    latitude: number;
    longitude: number;
    category: StoreCategory;
}

// 検索に使う型
export interface SearchableStore extends Store {
    search_keyword: string;       // store_name + address + phone_numberの組み合わせ
    distance_from_user: number;   // ユーザーの現在地からの直線距離
}

export interface StoreCategory {
    area: number;
    parking: boolean;
    barrierFree: boolean;
    cashless: boolean;
    foodProvider: boolean;
    freeWifi: boolean;
    demaeCan: boolean,
    uber: boolean,
    walt: boolean,
    CustomURLSchemeDemaekan: string;  // 出前館のカスタムURLスキーム
    CustomURLSchemeUber: string;      // UberのカスタムURLスキーム
    CustomURLSchemeWalt: string;      // WaltのカスタムURLスキーム
}


export interface TestData {
    stores: Store[];
}

export interface SearchableStoreData {
    stores: SearchableStore[];
}

// 実際のテストデータ
export const testData: TestData = {
    stores: [
        {
            store_id: 1,
            store_name: "サンプルストア1",
            phone_number: "03-1234-5678",
            address: "東京都渋谷区渋谷1-1-1",
            businessHours_start: "10:00",
            businessHours_end: "22:00",
            lineURLScheme: "https://line.me/R/ti/p/1234567",
            notices: "",
            latitude: 35.658034,
            longitude: 139.701636,
            category: {
                area: 13,
                parking: true,
                barrierFree: true,
                cashless: true,
                foodProvider: false,
                freeWifi: true,
                demaeCan: true,
                uber: false,
                walt: false,
                CustomURLSchemeDemaekan: "demae-can://sample-store-1",
                CustomURLSchemeUber: "",
                CustomURLSchemeWalt: ""
            }
        },
        {
            store_id: 2,
            store_name: "サンプルストア2",
            phone_number: "06-9876-5432",
            address: "大阪府大阪市中央区大阪1-1-1",
            businessHours_start: "10:00",
            businessHours_end: "22:00",
            lineURLScheme: "https://line.me/R/ti/p/1234567",
            notices: "",
            latitude: 34.681372,
            longitude: 135.502319,
            category: {
                area: 27,
                parking: true,
                barrierFree: true,
                cashless: true,
                foodProvider: true,
                freeWifi: false,
                demaeCan: false,
                uber: true,
                walt: false,
                CustomURLSchemeDemaekan: "",
                CustomURLSchemeUber: "uber://sample-store-2",
                CustomURLSchemeWalt: ""
            }
        },
        {
            store_id: 3,
            store_name: "サンプルストア3",
            phone_number: "092-1111-2222",
            address: "福岡県福岡市博多区福岡1-1-1",
            businessHours_start: "10:00",
            businessHours_end: "22:00",
            lineURLScheme: "https://line.me/R/ti/p/1234567",
            notices: "",
            latitude: 33.589886,
            longitude: 130.418064,
            category: {
                area: 40,
                parking: true,
                barrierFree: true,
                cashless: false,
                foodProvider: false,
                freeWifi: true,
                demaeCan: false,
                uber: false,
                walt: true,
                CustomURLSchemeDemaekan: "",
                CustomURLSchemeUber: "",
                CustomURLSchemeWalt: "walt://sample-store-3"
            }
        }
    ]
};

export interface SearchCriteria {
    userLatitude: number;  // ユーザーの緯度
    userLongitude: number; // ユーザーの経度
    area: number;          // 地域コード（0の場合は無視）
    keyword: string;       // 検索キーワード
    parking: boolean;      // 駐車場の有無
    barrierFree: boolean;  // バリアフリー対応
    cashless: boolean;     // キャッシュレス対応
    foodProvider: boolean; // フードプロバイダーの有無
    freeWifi: boolean;     // 無料Wi-Fiの有無
    demaeCan: boolean;     // 出前館サービスの有無
    uber: boolean;         // Uberサービスの有無
    walt: boolean;         // Waltサービスの有無
}
