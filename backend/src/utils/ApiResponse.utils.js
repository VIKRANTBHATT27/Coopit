class ApiResponse {
    constructor(statusCode, data, message = "Success", metaData = null) {
        if (!Number.isInteger(statusCode) || statusCode < 100 || statusCode > 599) {
            throw new TypeError("statusCode must be an integer between 100 and 599");
        }

        if (typeof message !== "string" || message.trim() === "") {
            throw new TypeError("message must be a non-empty string");
        }

        if (metaData !== null && typeof metaData !== "object") {
            throw new TypeError("metaData must be an object or null");
        }

        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.metaData = metaData;
        this.success = statusCode < 400;
    }
}

export default ApiResponse;