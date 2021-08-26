export const types = ({ list }) => list
export const oTypes = ({ list }) => list.reduce((p, c) => p.concat(c.name), []).sort();
