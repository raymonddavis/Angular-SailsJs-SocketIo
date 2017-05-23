import { LiveWebPage } from './app.po';

describe('live-web App', () => {
  let page: LiveWebPage;

  beforeEach(() => {
    page = new LiveWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
