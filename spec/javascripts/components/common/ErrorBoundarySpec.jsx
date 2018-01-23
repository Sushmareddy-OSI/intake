import React, {Component} from 'react'
import ErrorBoundary from 'common/ErrorBoundary'
import {shallow, mount} from 'enzyme'

class Error extends Component {
  render() {
    throw new Error('ErrorMessage');
  }
}

describe('ErrorBoundary', () => {
  let onerror
  beforeEach(() => {
    onerror = window.onerror
    window.onerror = () => null
  })
  afterEach(() => (window.onerror = onerror))

  it('renders an error copy when an error is thrown', () => {
    const component = mount(
      <ErrorBoundary>
        <Error/>
      </ErrorBoundary>
    )
    expect(component.text()).toEqual('An error has occured')
  })
  it('renders children when no error is thrown', () => {
    const component = shallow(
      <ErrorBoundary>
        <span>Hello</span>
      </ErrorBoundary>
    )
    expect(component.text()).toEqual('Hello')
  })
})
