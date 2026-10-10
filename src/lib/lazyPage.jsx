// Like React.lazy, but once a page has been preloaded it renders synchronously.
// React.lazy always suspends on first render, which shows a skeleton and makes React wait ~300ms
// before revealing the page. Preloading removes that delay so tab and nav clicks feel instant.
export function lazyPage(load) {
  let Comp = null, promise = null;
  const start = () => (promise ||= load().then((m) => { Comp = m.default; }).catch((e) => { promise = null; throw e; }));
  function Page(props) {
    if (Comp) return <Comp {...props} />;
    throw start();
  }
  Page.preload = start;
  return Page;
}
