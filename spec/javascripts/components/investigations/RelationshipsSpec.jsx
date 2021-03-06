import React from 'react'
import {shallow} from 'enzyme'
import {EmptyRelationships, Relationships} from 'investigations/Relationships'

describe('Relationships', () => {
  const renderRelationships = (props) => shallow(<Relationships {...props} />)
  it('renders people with no relationships', () => {
    const people = [
      {name: 'Sally Jones', relationships: []},
      {name: 'Nate Starbringer', relationships: []},
      {name: 'Jim Johnson', relationships: []},
    ]
    const component = renderRelationships({people})
    expect(component.find('.person').at(0).text()).toEqual('Sally Jones')
    expect(component.find('.person').at(1).text()).toEqual('Nate Starbringer')
    expect(component.find('.person').at(2).text()).toEqual('Jim Johnson')
  })

  it('renders relationships for each person', () => {
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {relatee: 'Jim Johnson', type: 'mother'},
        ],
      },
      {
        name: 'Nate Starbringer',
        relationships: [
          {relatee: 'Jim Johnson', type: 'father'},
        ],
      },
      {
        name: 'Jim Johnson',
        relationships: [
          {relatee: 'Nate Starbringer', type: 'son'},
          {relatee: 'Sally Jones', type: 'son'},
        ],
      },
    ]
    const component = renderRelationships({people})
    expect(component.find('.relationships').at(0).find('li').at(0).text()).toEqual('mother of Jim Johnson')
    expect(component.find('.relationships').at(1).find('li').at(0).text()).toEqual('father of Jim Johnson')
    expect(component.find('.relationships').at(2).find('li').at(1).text()).toEqual('son of Sally Jones')
    expect(component.find('.relationships').at(2).find('li').at(0).text()).toEqual('son of Nate Starbringer')
  })
})

describe('EmptyRelationships', () => {
  it('renders a reminder to add people when there are no relationships', () => {
    const component = shallow(<EmptyRelationships />)
    expect(component.find('.empty-relationships').text()).toEqual('Search for people and add them to see their relationships.')
  })
})
