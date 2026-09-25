const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError.js");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const details = errors.array();
        const message = details.map((error) => error.msg).join(", ");

        return next(new AppError(message, 400, details));
    }

    next();
};

module.exports = validate;