import {
  AGENCY_TYPES,
  DISTRICT_ATTORNEY,
  LAW_ENFORCEMENT,
  COUNTY_LICENSING,
  COMMUNITY_CARE_LICENSING,
} from 'enums/CrossReport'
import {
  getDistrictAttorneyAgenciesSelector,
  getLawEnforcementAgenciesSelector,
  getCountyLicensingAgenciesSelector,
  getCommunityCareLicensingAgenciesSelector,
} from 'selectors/screening/countyAgenciesSelectors'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import CrossReportForm from 'views/CrossReportForm'
import {fetch as fetchCountyAgencies} from 'actions/countyAgenciesActions'
import {
  clearAllAgencyFields,
  clearAllFields,
  resetFieldValues,
  save as saveCrossReport,
  setAgencyField,
  setAgencyTypeField,
  setField,
  touchAgencyField,
  touchAllFields,
  touchField,
} from 'actions/crossReportFormActions'
import {save as saveScreening} from 'actions/screeningActions'
import {setCardMode} from 'actions/screeningPageActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {
  getAllegationsRequireCrossReportsValueSelector,
  getVisibleErrorsSelector,
  getScreeningWithEditsSelector,
  getDistrictAttorneyFormSelector,
  getLawEnforcementFormSelector,
  getCountyLicensingFormSelector,
  getCommunityCareLicensingFormSelector,
} from 'selectors/screening/crossReportFormSelectors'

const mapStateToProps = (state) => ({
  allegationsRequireCrossReports: getAllegationsRequireCrossReportsValueSelector(state),
  areCrossReportsRequired: getAllegationsRequireCrossReportsValueSelector(state),
  communityCareLicensing: getCommunityCareLicensingFormSelector(state).toJS(),
  counties: state.get('counties').toJS(),
  county_id: state.getIn(['crossReportForm', 'county_id', 'value']) || '',
  countyAgencies: {
    [DISTRICT_ATTORNEY]: getDistrictAttorneyAgenciesSelector(state).toJS(),
    [LAW_ENFORCEMENT]: getLawEnforcementAgenciesSelector(state).toJS(),
    [COMMUNITY_CARE_LICENSING]: getCommunityCareLicensingAgenciesSelector(state).toJS(),
    [COUNTY_LICENSING]: getCountyLicensingAgenciesSelector(state).toJS(),
  },
  countyLicensing: getCountyLicensingFormSelector(state).toJS(),
  districtAttorney: getDistrictAttorneyFormSelector(state).toJS(),
  hasAgencies: Boolean(Object.keys(AGENCY_TYPES).reduce((result, key) => result || state.getIn(['crossReportForm', key, 'selected']), false)),
  errors: getVisibleErrorsSelector(state).toJS(),
  inform_date: state.getIn(['crossReportForm', 'inform_date', 'value']) || '',
  lawEnforcement: getLawEnforcementFormSelector(state).toJS(),
  method: state.getIn(['crossReportForm', 'method', 'value']) || '',
  screening: getScreeningSelector(state).toJS(),
  screeningWithEdits: getScreeningWithEditsSelector(state).toJS(),
})
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    clearAllAgencyFields,
    clearAllFields,
    resetFieldValues,
    saveCrossReport,
    setAgencyField,
    setAgencyTypeField,
    setField,
    touchAgencyField,
    touchAllFields,
    touchField,
    saveScreening,
    fetchCountyAgencies,
    setCardMode,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(CrossReportForm)
