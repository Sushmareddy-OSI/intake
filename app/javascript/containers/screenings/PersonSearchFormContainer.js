import {connect} from 'react-redux'
import PersonSearchForm from 'views/people/PersonSearchForm'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {
  getPeopleResultsSelector,
  getResultsTotalValueSelector,
  getSearchTermValueSelector,
} from 'selectors/peopleSearchSelectors'
import {createPerson} from 'actions/personCardActions'
import {search, setSearchTerm, clear} from 'actions/peopleSearchActions'
import * as IntakeConfig from 'common/config'

const mapStateToProps = (state) => ({
  screeningId: getScreeningIdValueSelector(state),
  canCreateNewPerson: IntakeConfig.isFeatureInactive('release_two'),
  hasAddSensitivePerson: state.getIn(['staff', 'add_sensitive_people']),
  results: getPeopleResultsSelector(state).toJS(),
  total: getResultsTotalValueSelector(state),
  searchTerm: getSearchTermValueSelector(state),
})

const mapDispatchToProps = (dispatch, _ownProps) => {
  const onClear = () => dispatch(clear())
  const onChange = (value) => dispatch(setSearchTerm(value))
  const onSearch = (value) => dispatch(search(value))
  return {
    onSearch,
    onClear,
    onChange,
    dispatch,
  }
}

const mergeProps = (stateProps, {onSearch, onClear, onChange, dispatch}) => {
  const {
    canCreateNewPerson,
    hasAddSensitivePerson,
    results,
    screeningId,
    searchTerm,
    total,
  } = stateProps
  const isSelectable = (person) => (person.sensitive === false || hasAddSensitivePerson)
  const onSelect = (person) => {
    const personOnScreening = {
      ...person,
      screening_id: screeningId,
      legacy_id: person.id,
      id: null,
    }
    dispatch(createPerson(personOnScreening))
  }
  return {
    canCreateNewPerson,
    isSelectable,
    onChange,
    onClear,
    onSearch,
    onSelect,
    results,
    searchTerm,
    total,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PersonSearchForm)
