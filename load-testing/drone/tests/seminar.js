describe('seminar', function() {
    it('seminar', function() {
      for(var b = browser, i = 0; i < 10; i++, b=b.forkNewDriverInstance(false)){
          b.waitForAngularEnabled(false);
          b.get('https://dialect.live/room/9999/username/user' + Math.ceil(Math.random()*1e10));
          // b.sleep(1000);
      }
      browser.sleep(600*1000);
    });
  });