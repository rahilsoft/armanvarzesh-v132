module.exports = {
  ci: {
    collect: {
      url: [process.env.SITE_URL || 'http://localhost:3001'],
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        'categories:pwa': ['error', {minScore: 0.9}],
        'categories:performance': ['warn', {minScore: 0.7}],
        'tap-targets': 'warn',
        'uses-responsive-images': 'warn'
      }
    }
  }
};