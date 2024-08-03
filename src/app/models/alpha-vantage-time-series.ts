export class AVTimeSeries {
    "Meta Data": metaData;
    "Time Series (Daily)": {
        [date: string]: timeSeries;
    }[];
}
class metaData {
    "1. Information": string;
    "2. Symbol": string;
    "3. LastRefreshed": string;
    "4. Output Size": string;
    "5. Time Zone": string;
}

class timeSeries {
    "1. open": number;
    "2. high": number;
    "3. low": number;
    "4. close": number;
    "5. volume": number;
}
