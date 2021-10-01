const contentToURIParams = content => (content
  ? Object.keys(content)
    .map(key => `${key}=${encodeURIComponent(content[key])}`)
    .join('&')
  : '');

export default contentToURIParams;
