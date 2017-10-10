import FormField from 'common/FormField'
import PropTypes from 'prop-types'
import React from 'react'

const TextField = ({
  errors,
  gridClassName,
  id,
  label,
  labelClassName,
  maxLength,
  onBlur,
  onChange,
  required,
  value,
  disabled,
}) => {
  const formFieldProps = {
    disabled: disabled,
    errors: errors,
    gridClassName: gridClassName,
    id: id,
    label: label,
    labelClassName: labelClassName,
    required: required,
  }
  const textareaProps = {
    disabled: disabled,
    id: id,
    maxLength: maxLength,
    onBlur: onBlur,
    onChange: onChange,
    required: required,
    value: value,
  }

  return (
    <FormField {...formFieldProps} >
      <textarea {...textareaProps} />
    </FormField>
  )
}

TextField.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.array,
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  maxLength: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}
export default TextField
