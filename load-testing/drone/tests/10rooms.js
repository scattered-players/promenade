describe('10rooms', function() {
    it('10rooms', function() {
      var order = browser.params.order,
          startingIndex = Math.floor(order/5)*5+1;
      for(var b = browser, i = startingIndex; i < startingIndex+5; i++, b=b.forkNewDriverInstance(false)){
          b.waitForAngularEnabled(false);
          b.get('https://dialect.live/room/' + i + '/username/user' + Math.ceil(Math.random()*1e10));
          // b.sleep(1000);
      }
      browser.sleep(600*1000);
    });
  });