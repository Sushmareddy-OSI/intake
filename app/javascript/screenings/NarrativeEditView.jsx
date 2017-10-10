import PropTypes from 'prop-types'
import React from 'react'
import TextField from 'common/TextField'

const NarrativeEditView = ({errors, screening, onBlur, onCancel, onChange, onSave}) => (
  <div className='card-body'>
    <div className='row'>
      <TextField
        errors={errors.report_narrative}
        gridClassName='col-md-12'
        id='report_narrative'
        label='Report Narrative'
        onBlur={(event) => onBlur(event)}
        onChange={(event) => onChange(['report_narrative'], event.target.value || null)}
        required
        value={screening.get('report_narrative') || ''}
      />
    </div>
    <div className='row'>
      <div className='centered'>
        <button className='btn btn-primary' onClick={onSave}>Save</button>
        <button className='btn btn-default' onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
)

NarrativeEditView.propTypes = {
  errors: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  screening: PropTypes.object.isRequired,
}
export default NarrativeEditView
