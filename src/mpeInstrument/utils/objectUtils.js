export const transformObject = (object, transformations={}) => {
  const changedValues = Object.keys(transformations).reduce((acc, key) => {
    if (typeof object[key] !== 'undefined') {
      acc[key] = transformations[key](object[key]);
    }
    return acc;
  }, {});

  return Object.assign({}, object, changedValues);
};
