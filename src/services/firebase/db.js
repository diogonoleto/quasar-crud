import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/database'

export const firestore = () => {
  return firebase.firestore()
}
export const getById = (collectName, id) => {
  return firestore().collection(collectName).doc(id)
}
export const getByAttr = (collectName, attr) => {
  let collect = firestore().collection(collectName)
  Object.keys(attr).forEach(a => {
    collect = collect.where(a, '==', attr[a])
  })
  return collect;
}
export const getFirstByAttr = (commit, collectName, state, attr) => {
  let collect = firestore().collection(collectName)
  Object.keys(attr).forEach(a => {
    collect = collect.where(a, '==', attr[a])
  })
  collect.onSnapshot((snapshot) => {
    if (snapshot.size === 1) {
      snapshot.forEach(doc => {
        commit(state, doc.data())
      })
    }
  })
  return collect;
}
export const create = (collectName, obj) => {
  obj.p.id = firestore().collection(collectName).doc().id
  let collect = firestore().collection(collectName).doc(obj.p.id)
  Object.keys(obj).forEach(o => {
    if (o == 'reference') {
      Object.keys(obj[o]).forEach(r => {
        obj.p[r] = firestore().doc(obj[o][r])
      })
    }
  })
  firestore().collection(collectName).doc(obj.p.id).set(Object.assign({}, obj.p))
  return collect
}
export const createOrUpdate = (collectName, obj, attr) => {
  var collect = firestore().collection(collectName)
  Object.keys(attr).forEach(a => {
    collect = collect.where(a, '==', attr[a])
  })
  Object.keys(obj).forEach(o => {
    if (o == 'reference') {
      Object.keys(obj[o]).forEach(r => {
        obj.p[r] = firestore().doc(obj[o][r])
      })
    }
  })
  return new Promise((resolve) => {
    let collect2 = firestore().collection(collectName)
    collect.onSnapshot((snapshot) => {
      if (snapshot.size === 0) {
        obj.p.id = firestore().collection(collectName).doc().id
        collect2.doc(obj.p.id).set(Object.assign({}, obj.p))
      } else {
        snapshot.forEach(doc => {
          obj.p.id = doc.id
        })
        collect2.doc(doc.id).update(Object.assign({}, obj.p))
      }
      resolve({ id: obj.p.id, collect: collect2 })
    })
  })
}

export const update = (collectName, payload) => {
  const ref = firestore().collection(collectName).doc(payload.id);
  ref.update(Object.assign({}, payload))
  return ref
}
export const searchUser = (collectName, cpf) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('users')
      .where('cpf', '==', cpf)
      .where('active', '==', true).onSnapshot((s) => {
        if (s.size > 0) {
          s.forEach(d => {
            resolve(d.data())
          })
        } else {
          reject('Usuário não existe')
        }
      })
  })
    .then(user => {
      return new Promise((resolve) => {
        var u = firestore().collection('users').doc(user.id)
        firestore().collection(collectName).where('user', '==', u)
          .onSnapshot((s) => {
            if (s.size > 0) {
              s.forEach(d => {
                user.parent = d.data().id
                resolve(user)
              })
            } else {
              resolve(user)
            }
          })
      })
    })
}
export const search = (colName1, param, colName2, attr) => {
  return new Promise((resolve, reject) => {
    var collect = firestore().collection(colName1)
    Object.keys(attr).forEach(a => {
      collect = collect.where(a, '==', attr[a])
    })
    collect.onSnapshot((s) => {
      if (s.size > 0) {
        s.forEach(d => {
          resolve(d.data())
        })
      } else {
        reject('não existe')
      }
    })
  })
    .then(resp => {
      return new Promise((resolve) => {
        var u = firestore().collection(colName1).doc(resp.id)
        firestore().collection(colName2).where(param, '==', u)
          .onSnapshot((s) => {
            if (s.size > 0) {
              s.forEach(d => {
                resp.parent = d.data().id
                resolve(resp)
              })
            } else {
              resolve(resp)
            }
          })
      })
    })
}
export const storageRef = (storageLocation) => {
  return firebase.storage().ref(storageLocation)
}