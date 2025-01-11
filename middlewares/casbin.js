const { newEnforcer } = require('casbin');

let enforcer;

// Load Casbin model and policies
const loadCasbin = async () => {
    enforcer = await newEnforcer('rbac_model.conf', 'policy.csv');
};

// Middleware for RBAC authorization
const casbinMiddleware = async (req, res, next) => {
    try {
        const { role } = req.user; // Role from authenticated user
        const { obj, act } = req.body; // Object and action from the request

        const allowed = await enforcer.enforce(role, obj, act);
        if (!allowed) return res.status(403).json({ error: 'Access denied' });

        next();
    } catch (error) {
        res.status(500).json({ error: 'Authorization error' });
    }
};

module.exports = { loadCasbin, casbinMiddleware };
