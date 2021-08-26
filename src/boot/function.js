export default ({ Vue }) => {
  const plugin = {
    install (Vue) {
      Vue.prototype.sortArray = (v, i = 'created_at', s = 'a') => {
        if (!v) return v;
        if (s == 'a') {
          return v
            ? v
              .slice()
              .sort((a, b) =>
                a.normalize('NFD') > b.normalize('NFD')
                  ? 1
                  : b.normalize('NFD') > a.normalize('NFD')
                    ? -1
                    : 0
              )
            : [];
        } else {
          return v
            ? v
              .slice()
              .sort((a, b) =>
                a.normalize('NFD') < b.normalize('NFD')
                  ? 1
                  : b.normalize('NFD') < a.normalize('NFD')
                    ? -1
                    : 0
              )
            : [];
        }
      }
      Vue.prototype.sort = (v, i = 'created_at', s = 'a') => {
        if (!v) return v;
        if (s == 'a') {
          return v ? v.slice().sort((a, b) => a[i] > b[i] ? 1 : b[i] > a[i] ? -1 : 0) : [];
        } else {
          return v ? v.slice().sort((a, b) => a[i] < b[i] ? 1 : b[i] < a[i] ? -1 : 0) : [];
        }
      }
      Vue.prototype.sortName = (v, i = 'created_at', s = 'a') => {
        if (!v) return v;
        if (s == 'a') {
          return v ? v.slice().sort((a, b) => a[i].normalize('NFD') > b[i].normalize('NFD') ? 1 : b[i].normalize('NFD') > a[i].normalize('NFD') ? -1 : 0) : [];
        } else {
          return v ? v.slice().sort((a, b) => a[i].normalize('NFD') < b[i].normalize('NFD') ? 1 : b[i].normalize('NFD') < a[i].normalize('NFD') ? -1 : 0) : [];
        }
      }
    }
  }
  Vue.use(plugin)
}
