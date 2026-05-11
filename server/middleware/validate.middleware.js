export function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && (value === undefined || value === null || value === "")) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value !== undefined && rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be a ${rules.type}`);
      }
    }

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    next();
  };
}
