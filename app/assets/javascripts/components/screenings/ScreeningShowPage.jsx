import * as screeningActions from 'actions/screeningActions'
import AllegationsCardView from 'components/screenings/AllegationsCardView'
import CrossReportCardView from 'components/screenings/CrossReportCardView'
import DecisionCardView from 'components/screenings/DecisionCardView'
import HistoryCard from 'components/screenings/HistoryCard'
import Immutable from 'immutable'
import IncidentInformationCardView from 'components/screenings/IncidentInformationCardView'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import React from 'react'
import ScreeningInformationCardView from 'components/screenings/ScreeningInformationCardView'
import WorkerSafetyShowView from 'components/screenings/WorkerSafetyShowView'
import {IndexLink, Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

export class ScreeningShowPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loaded: false,
      screening: props.screening,
      screeningEdits: Immutable.Map(),
      participantsEdits: Immutable.Map(),
    }
    this.cancelEdit = this.cancelEdit.bind(this)
    this.cardSave = this.cardSave.bind(this)
    this.deleteParticipant = this.deleteParticipant.bind(this)
    this.setField = this.setField.bind(this)
    this.saveParticipant = this.saveParticipant.bind(this)
    this.setParticipantField = this.setParticipantField.bind(this)
    this.cancelParticipantEdit = this.cancelParticipantEdit.bind(this)
  }

  componentDidMount() {
    this.props.actions.fetchScreening(this.props.params.id)
      .then(() => this.setState({loaded: true}))
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.screening.equals(nextProps.screening)) {
      this.setState({screening: nextProps.screening})
    }
  }

  setField(fieldSeq, value, callback) {
    const screeningEdits = this.state.screeningEdits.setIn(fieldSeq, value)
    this.setState({screeningEdits: screeningEdits}, callback)
  }

  cardSave(fieldList) {
    const changes = this.state.screeningEdits.filter((value, key) =>
      fieldList.includes(key) && value !== undefined
    )
    const screening = this.state.screening.merge(changes)
    return this.props.actions.saveScreening(screening.toJS())
  }

  cancelEdit(fieldList) {
    const updatedEdits = this.state.screeningEdits.filterNot((value, key) => fieldList.includes(key))
    this.setState({screeningEdits: updatedEdits})
  }

  deleteParticipant(id) {
    this.props.actions.deleteParticipant(id)
  }

  setParticipantField(id, value) {
    const participantsEdits = this.state.participantsEdits.set(id, value)
    this.setState({participantsEdits: participantsEdits})
  }

  cancelParticipantEdit(id) {
    const updatedParticipantsEdits = this.state.participantsEdits.delete(id)
    this.setState({participantsEdits: updatedParticipantsEdits})
  }

  saveParticipant(participant) {
    return this.props.actions.saveParticipant(participant.toJS())
  }

  participants() {
    // We want to merge the keys of each participant, but we don't want deep merge
    // to combine the address lists for us. So, we do a custom merge at one level deep.
    const mergedParticipants = this.props.participants.map((participant) => {
      const participantId = participant.get('id')
      const relevantEdits = this.state.participantsEdits.get(participantId)
      const participantEdits = (relevantEdits || Immutable.Map())
      return participant.merge(participantEdits)
    })

    return mergedParticipants
  }

  renderParticipantsCard() {
    const participants = this.participants()

    return (
      <div>
        {
          participants.map((participant) =>
            <ParticipantCardView
              key={participant.get('id')}
              onCancel={this.cancelParticipantEdit}
              onDelete={this.deleteParticipant}
              onChange={this.setParticipantField}
              onSave={this.saveParticipant}
              participant={participant}
              mode='show'
            />
          )
        }
      </div>
    )
  }

  render() {
    const {params} = this.props
    const {loaded, screening} = this.state
    const mergedScreening = screening.merge(this.state.screeningEdits)
    return (
      <div>
        <h1>{`Screening #${mergedScreening.get('reference')}`}</h1>
        { loaded &&
          <ScreeningInformationCardView
            mode='show'
            screening={mergedScreening}
            onCancel={this.cancelEdit}
            onChange={this.setField}
            onSave={this.cardSave}
          />
        }
        {this.renderParticipantsCard()}
        {
          loaded &&
            <NarrativeCardView
              mode='show'
              narrative={mergedScreening.get('report_narrative')}
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
            />
        }
        {
          loaded &&
            <IncidentInformationCardView
              mode='show'
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
              screening={mergedScreening}
            />
        }
        <AllegationsCardView mode='show' allegations={Immutable.List()}/>
        <WorkerSafetyShowView />
        <HistoryCard />
        {
          loaded &&
            <CrossReportCardView
              crossReport={mergedScreening.get('cross_reports')}
              mode='show'
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
            />
        }
        {
          loaded &&
          <DecisionCardView
            mode='show'
            onCancel={this.cancelEdit}
            onChange={this.setField}
            onSave={this.cardSave}
            screening={mergedScreening}
          />
        }
        <IndexLink to='/' className='gap-right'>Home</IndexLink>
        <Link to={`/screenings/${params.id}/edit`}>Edit</Link>
      </div>
    )
  }
}

ScreeningShowPage.propTypes = {
  actions: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
  participants: React.PropTypes.object.isRequired,
  screening: React.PropTypes.object.isRequired,
}

function mapStateToProps(state, _ownProps) {
  return {
    participants: state.participants,
    screening: state.screening,
  }
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators(screeningActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningShowPage)
