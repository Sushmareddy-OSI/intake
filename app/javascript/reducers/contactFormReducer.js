import {
  BUILD_CONTACT_SUCCESS,
  SET_CONTACT_FIELD,
  TOUCH_CONTACT_FIELD,
  TOUCH_ALL_CONTACT_FIELDS,
  SELECT_CONTACT_PERSON,
  DESELECT_CONTACT_PERSON,
} from 'actions/contactFormActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [BUILD_CONTACT_SUCCESS](_state, {investigation_id, investigation_started_at, people = []}) {
    const fieldWithTouch = {value: null, touched: false}
    const fieldWithValue = (value) => ({value: value})
    return fromJS({
      id: fieldWithValue(null),
      investigation_id: fieldWithValue(investigation_id),
      started_at: fieldWithTouch,
      status: fieldWithTouch,
      note: fieldWithValue(null),
      purpose: fieldWithTouch,
      communication_method: fieldWithTouch,
      location: fieldWithTouch,
      investigation_started_at: fieldWithValue(investigation_started_at),
      people: people.map(({first_name, last_name, middle_name, name_suffix, legacy_descriptor}) => ({
        first_name,
        last_name,
        middle_name,
        name_suffix,
        legacy_descriptor,
        selected: false,
        touched: false,
      })),
    })
  },
  [SET_CONTACT_FIELD](state, {field, value}) {
    return state.setIn([field, 'value'], value)
  },
  [TOUCH_CONTACT_FIELD](state, {field}) {
    return state.setIn([field, 'touched'], true)
  },
  [TOUCH_ALL_CONTACT_FIELDS](state, _) {
    const fieldsWithTouch = [
      'started_at', 'status', 'purpose', 'communication_method', 'location',
    ]
    return fieldsWithTouch.reduce(
      (contact, field) => contact.setIn([field, 'touched'], true),
      state
    ).set('people', state.get('people').map((person) => person.set('touched', true)))
  },
  [SELECT_CONTACT_PERSON](state, {index}) {
    return state.setIn(['people', index, 'selected'], true)
      .setIn(['people', index, 'touched'], true)
  },
  [DESELECT_CONTACT_PERSON](state, {index}) {
    return state.setIn(['people', index, 'selected'], false)
      .setIn(['people', index, 'touched'], true)
  },
})
