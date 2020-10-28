exports.config = {
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            'args': [ 
                '--headless', 
                '--disable-gpu', 
                '--use-fake-ui-for-media-stream',
            ]
        },
    },
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  suites: {
    '1room': 'tests/1room.js',
    '10rooms': 'tests/10rooms.js',
    '20rooms': 'tests/20rooms.js',
    'seminar': 'tests/seminar.js',
  },
  jasmineNodeOpts: {defaultTimeoutInterval: 600 * 1000}
}