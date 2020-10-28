describe('1room', function() {
    it('1room', function() {
      var order = browser.params.order;
      if(order < 10){
        browser.waitForAngularEnabled(false);
        browser.get('https://dialect.live/room/1/username/user' + Math.ceil(Math.random()*1e10));
        browser.sleep(600*1000);
      }
    });
  });