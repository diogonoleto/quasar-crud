import { firestoreAction } from 'vuexfire'
import { update, getByAttr, create } from 'src/services/firebase/db.js'
import Type from 'src/models/Type'

export const typeList = firestoreAction(({ bindFirestoreRef }) => {
    return bindFirestoreRef('list', getByAttr('process_types', { deleted_at: null }))
})
export const typeCreateOrUpdate = async (state, payload) => {
    if (payload.id) {
        return update('process_types', payload)
    } else {
        let p = new Type(payload)
        return create('process_types', { p: p })
    }
}
export const typeDelete = (state, payload) => {
    payload.deleted_at = new Date()
    return update('process_types', payload)
}