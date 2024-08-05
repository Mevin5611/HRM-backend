// middleware/authorizedRole.js
import User from '../models/userModel.js'

export const authorizedRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === requiredRole) {
        next();
      } else {
        res.status(403).json({ error: 'Access forbidden: Insufficient permissions' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export default authorizedRole;
