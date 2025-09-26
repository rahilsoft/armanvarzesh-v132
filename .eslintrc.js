module.exports = { rules: {} };

// Auto-injected security rules
const restricted = { selector: "CallExpression[callee.property.name='queryRawUnsafe']", message: 'Use $queryRaw (parameterized) instead of $queryRawUnsafe' };
module.exports.rules = Object.assign({}, module.exports.rules, {
  'no-restricted-syntax': ['error', restricted],
  'no-console': 'warn'
});

// Added by Phase 4
module.exports = {
  ...(module.exports || {}),
  rules: {
    ...(module.exports && module.exports.rules ? module.exports.rules : {}),
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-restricted-imports': ['error', {
      'paths': [{
        'name': 'axios',
        'message': 'Import @arman/http-client instead of axios directly.'
      }]
    }]
  }
}
