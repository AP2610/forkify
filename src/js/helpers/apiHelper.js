export default class APIHelper {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }
    setBaseUrl(url){
        this.baseUrl = url;
    }
    getBaseUrl(){
        const baseUrl = this.baseUrl
        return baseUrl;
    }
    get(endPoint){
        const url = this.baseUrl + endPoint;
        const apiResponse = fetch(url);
        if (apiResponse.status === 402) {
            return alert("You've reached the maximum limit of searches for the day (Sorry, I'm using a free API :P)")
        };
        const apiCall = apiResponse.then(response => response.json());
        return apiCall; 
    };
    getWithHeaders(endPoint){
        const url = this.baseUrl + endPoint;
        const apiResponse = fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (apiResponse.status === 402) {
            return alert("You've reached the maximum limit of recipes for the day (Sorry, I'm using a free API :P)")
        };
        const apiCall = apiResponse.then(response => response.json())
        return apiCall;
    }
    post(endPoint, data){
        const url = this.baseUrl + endPoint;
        const apiCall = fetch (url, 
        {
            method: "POST",
            headers: {
                "Content-Type": "applicationn/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        return apiCall;
    }
};