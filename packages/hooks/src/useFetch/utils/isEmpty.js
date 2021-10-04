// because Object.keys(new Date()).length === 0;
// we have to do some additional check
const isEmpty = obj => !obj // 👈 null and undefined check
  || Object.keys(obj).length === 0
  && obj.constructor === Object;

export default isEmpty;
