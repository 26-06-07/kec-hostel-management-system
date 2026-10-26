/**
 * Role-Based Access Control (RBAC) Middleware
 * @param  {...string} allowedRoles - List of permitted roles: 'student', 'caretaker', 'warden', 'admin'
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: Role identification is missing.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}].`
      });
    }

    next();
  };
}

module.exports = authorizeRoles;
