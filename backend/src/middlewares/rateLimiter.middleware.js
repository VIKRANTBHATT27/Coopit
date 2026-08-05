import rateLimit from "express-rate-limit";

const updatePhoneLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: { err: "Too many attempts. Try again later." }
});

export default updatePhoneLimiter;