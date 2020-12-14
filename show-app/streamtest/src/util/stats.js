import Stats from 'stats.js'

export const mainFps = new Stats();
mainFps.showPanel(0);
mainFps.dom.removeAttribute('style');

export const ramStats = new Stats();
ramStats.showPanel(2);
ramStats.dom.removeAttribute('style');

export const workerFps = new Stats();
workerFps.showPanel(0);
workerFps.dom.removeAttribute('style');

!function updateStats(){
  requestAnimationFrame(updateStats);
  mainFps.update();
  ramStats.update();
}()