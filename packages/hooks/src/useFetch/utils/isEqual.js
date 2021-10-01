// there is no changes on object's key order
const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

export default isEqual;
