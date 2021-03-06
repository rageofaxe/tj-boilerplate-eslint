import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';

import Menu from '../../components/Menu'
import FieldsSidebar from '../../components/FieldsSidebar'
import FieldsSidebarItem from '../../components/FieldsSidebar/item'

import Report from '../../components/Report'
import FieldsMap from '../FieldsMap/'

import * as FieldsActions from '../../actions/fields'
import {
  API_FIELDS,
  API_SECTORS,
  API_ALL_FIELDS,
} from '../../constants'
import style from './style.css'

const FERTILIZERS = 'fertilizers'
const REPORT = 'report'

class Fields extends Component {

  state = {
    isOpen: false,
    subRoute: REPORT,
  }

  selectField = (field) => {
    this.props.actions.selectField(field)
    this.props.actions.callLayers(field)
    this.props.actions.callGeometry(field)
    browserHistory.push(`/fields/${field.id}`);
  }

  apiFields = () => {
    fetch(`${API_FIELDS}?limit=20&offset=0`)
    .then(response => response.json())
    .then(({ data }) => {
      this.props.actions.updateFields(data)
      this.selectField(data.rows[0])
    })
  }

  apiSectors = () => {
    fetch(`${API_SECTORS}${this.props.report.id}`)
    .then(response => response.json())
    .then((data) => {
      this.props.actions.getSectors(data.data)
    })
  }

  apiAllFields = () => {
    fetch(`${API_ALL_FIELDS}${this.props.report.id}`)
    .then(response => response.json())
    .then((data) => {
      this.props.actions.getAllFields(data.data)
    })
  }

  // FIXME: move to store
  componentWillMount() {
    this.apiFields()
    this.apiAllFields()
  }

  componentDidMount() {
    this.props.actions.selectField(this.props.report.id)
  }

  // FIXME: move to sagas
  componentDidUpdate() {
    // this.apiSectors()
  }

  render() {
    const { actions, fields, settings, currentRoute } = this.props

    return (
      <div>
	      <Menu />
        <div className={style.root}>
          <div className={style.flex}>
            <FieldsSidebar>
              <div className={style.scrollBar}>
                {fields.rows.map((item, i) => <FieldsSidebarItem
                  key={i}
                  title={item.title}
                  culture={item.culture}
                  area={item.area}
                  image={item.image}
                  isActive={this.props.report.id === item.id}
                  onClick={() => this.selectField(item)}
                />)}
              </div>
            </FieldsSidebar>

            <div className={style.content}>
              <Report
                className={this.state.subRoute === 'report' ? style.slideUp : style.slideDown}
                data={this.props.report}
                currentRoute={currentRoute}
              />

              <div className={style.map}>
                <div className={style.subRouting}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span
                      onClick={() => this.setState({subRoute: 'report'})}
                    >
                      {this.props.report.title}
                    </span>
                    <span
                      onClick={() => this.setState({subRoute: 'fertilizers'})}
                      style={{display: 'flex', alignItems: 'center', marginRight: 48, color: '#d6d6d6'}}
                    >
                      Поле на карте
                      <img
                        src="/public/svg/map.svg"
                        style={{marginLeft: 8}}
                      />
                    </span>

                  </div>

                </div>
                <FieldsMap />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ fields, report, settings, routing }) {
  return {
    fields,
    report,
    settings,
    currentRoute: routing.locationBeforeTransitions.pathname,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(FieldsActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fields)
