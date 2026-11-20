class APIError extends Error {
    constructor(
        statusCode = 500,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;         // custom stack trace if provided
        } else {
            Error.captureStackTrace(this, this.constructor);       // auto-generate stack trace
        }
    }
};

export default APIError;