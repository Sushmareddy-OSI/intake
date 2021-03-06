import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {getUserNameSelector} from 'selectors/userInfoSelectors'
import {fetch as fetchUserInfoAction} from 'actions/userInfoActions'
import {bindActionCreators} from 'redux'
import {GlobalHeader} from 'react-wood-duck'
import userNameFormatter from 'utils/userNameFormatter'
import {config} from '../common/config'

export class App extends React.Component {
  componentDidMount() {
    this.props.actions.fetchUserInfoAction()
  }

  render() {
    const logoutUrl = `${config().base_path.replace(/\/$/, '')}/logout`
    return (
      <div>
        <GlobalHeader profileName={this.props.fullName} logoutCallback={() => (window.location.href = logoutUrl)} />
        {this.props.children}
      </div>
    )
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  fullName: PropTypes.string,
}
const mapStateToProps = (state) => ({
  fullName: userNameFormatter(getUserNameSelector(state)),
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators({fetchUserInfoAction}, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
