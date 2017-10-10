import React from 'react'
import {shallow} from 'enzyme'
import TextField from 'common/TextField'

describe('TextField', () => {
  let component
  let formField
  let onChange
  let onBlur

  const props = {
    disabled: false,
    errors: [],
    gridClassName: 'myWrapperTest',
    id: 'myTextFieldId',
    label: 'this is my label',
    labelClassName: 'myLabelTest',
    maxLength: '125',
    required: false,
    value: 'this is my field value',
  }

  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    onBlur = jasmine.createSpy('onBlur')
  })

  describe('basic functionality', () => {
    beforeEach(() => {
      component = shallow(<TextField {...props} onChange={onChange} onBlur={onBlur} />)
      formField = component.find('FormField')
    })

    it('passes props to the FormField', () => {
      expect(formField.props().labelClassName).toEqual('myLabelTest')
      expect(formField.props().gridClassName).toEqual('myWrapperTest')
      expect(formField.props().id).toEqual('myTextFieldId')
      expect(formField.props().label).toEqual('this is my label')
      expect(formField.props().errors).toEqual([])
      expect(formField.props().required).toBe(false)
      expect(formField.childAt(0).node.type).toEqual('textarea')
      expect(formField.props().disabled).toBe(false)
    })

    it('renders the textarea value', () => {
      const textareaElement = component.find('textarea')
      expect(textareaElement.props().value).toEqual('this is my field value')
    })

    it('renders the textarea length', () => {
      const textareaElement = component.find('textarea')
      expect(textareaElement.props().maxLength).toEqual('125')
    })

    it('calls onChange when a change event occurs on textarea field', () => {
      const textareaElement = component.find('textarea')
      textareaElement.simulate('change', {target: {value: 'hola mundo'}})
      expect(onChange).toHaveBeenCalledWith({target: {value: 'hola mundo'}})
    })

    it('calls onBlur when a blur event occurs on textarea field', () => {
      const textareaElement = component.find('textarea')
      textareaElement.simulate('blur')
      expect(onBlur).toHaveBeenCalled()
    })
  })

  describe('when it is NOT required', () => {
    beforeEach(() => {
      component = shallow(<TextField {...props} onChange={onChange} onBlur={onBlur} />)
    })

    it('renders the FormField as not required', () => {
      expect(component.find('FormField').props().required).toBe(false)
    })

    it('renders the textarea as not required', () => {
      expect(component.find('textarea').required).toEqual(undefined)
    })
  })

  describe('when it is required', () => {
    beforeEach(() => {
      component = shallow(<TextField {...props} onChange={onChange} onBlur={onBlur} required/>)
    })

    it('renders a required FormField', () => {
      expect(component.find('FormField').props().required).toBe(true)
    })

    it('renders a required textarea field', () => {
      expect(component.find('textarea').prop('required')).toBe(true)
    })
  })

  describe('when it is disabled', () => {
    beforeEach(() => {
      component = shallow(<TextField {...props} onChange={onChange} onBlur={onBlur} disabled/>)
    })

    it('renders a disabled textarea field', () => {
      expect(component.find('FormField').props().disabled).toBe(true)
      expect(component.find('textarea').prop('disabled')).toBe(true)
    })
  })
})
