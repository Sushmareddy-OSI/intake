import * as screeningActions from 'actions/screeningActions'
import {get} from 'utils/http'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningsTable from 'screenings/ScreeningsTable'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {trackEvent} from 'actions/analyticsActions.js'
import {loadGoogleAnalytics} from 'utils/analyticsHelper.js'
// import * as ga from 'utils/analyticsHelper.js'
import * as IntakeConfig from 'common/config'

export class HomePage extends React.Component {
  constructor() {
    super(...arguments)
    this.getScreenings = this.getScreenings.bind(this)
    this.createScreening = this.createScreening.bind(this)
    this.state = {screenings: []}
  }

  componentDidMount() {
    loadGoogleAnalytics()
    // ga.loadGoogleAnalytics()
    if (IntakeConfig.isFeatureInactive('release_two')) {
      this.getScreenings()
    }
  }

  createScreening() {
    this.props.actions.createScreening()
    // ga.trackEvent('Create', 'Screening')
    this.props.actions.trackEvent('Create', 'Screening')
  }

  getScreenings() {
    get('/api/v1/screenings').then((screenings) => this.setState({screenings}))
  }

  render() {
    return (
      <div className='row gap-top'>
        <div className='col-md-3'>
          <Link to='#' onClick={() => { this.createScreening() }}>Start Screening</Link>
        </div>
        <div className='col-md-9'>
          { IntakeConfig.isFeatureInactive('release_two') && <ScreeningsTable screenings={this.state.screenings} /> }
        </div>
      </div>
    )
  }
}

HomePage.propTypes = {
  actions: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  screening: PropTypes.object.isRequired,
}

function mapStateToProps(state, ownProps) {
  return {
    screening: state.get('screening'),
    router: ownProps.router,
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators({...screeningActions, trackEvent: trackEvent}, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
