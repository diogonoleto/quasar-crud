export const interests = ({ list }) => list.filter(i => i.deleted_at == null)
export const oInterests = ({ list }) => list.filter(i => i.deleted_at == null).reduce((p, c) => p.concat(c.name), []).sort();
