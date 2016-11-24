export function transformObject(object, transformations={}) {
  const changedValues = Object.keys(transformations).reduce((acc={}, key) => {
    acc[key] = transformations[key](object[key]);
    return acc;
  });

  return Object.assign({}, object, changedValues);
}
