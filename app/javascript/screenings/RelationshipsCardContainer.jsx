import {connect} from 'react-redux'
import RelationshipsCard from 'screenings/RelationshipsCard'
import {getPeopleSelector} from 'selectors/screening/relationshipsSelectors'

const mapStateToProps = (state, _ownProps) => ({
  areRelationshipsEmpty: getPeopleSelector(state).isEmpty(),
})

export default connect(mapStateToProps)(RelationshipsCard)
