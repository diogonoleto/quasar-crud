import { firestoreAction } from 'vuexfire'
import { getById, update, getByAttr, create } from 'src/services/firebase/db.js'
import Address from 'src/models/Address'

export const currentGet = firestoreAction(({ bindFirestoreRef }, id) => {
    return bindFirestoreRef('current', getById('users', id))
})
export const currentCreateOrUpdate = async ({ state }, payload) => {
    payload.id = state.current.id
    return update('users', payload)
}
export const addressList = firestoreAction(({ state, bindFirestoreRef }) => {
    return bindFirestoreRef('addresses', getByAttr('user_addresses', { user_id: state.current.id, deleted_at: null }))
})
export const addressCreateOrUpdate = async ({ state }, payload) => {
    if (payload.id) {
        return update('user_addresses', payload)
    } else {
        payload.user_id = state.current.id
        let p = new Address(payload)
        return create('user_addresses', { p: p })
    }
}
export const addressDelete = ({ }, payload) => {
    payload.deleted_at = new Date()
    return update('user_addresses', payload)
}