import * as React from 'react'
import { ChartReviewForm } from './ChartReviewForm'
import { ChartReviewSummaryForm } from './ChartReviewSummaryForm'
import { readModel } from './readmodel'

// import {v1 as uuidv1} from 'uuid'

// https://github.com/piotrwitek/react-redux-typescript-guide#stateful-components---class

export interface IGroup {
  hospital?: string
  selectOptions: IDynamicSelectOptions
}

export interface IGroups {
  [key: string]: IGroup
}

export interface IDynamicSelectOptions {
  providers: string[]
  conditions: string[]
  hospitals?: string[]
}

export interface IProviderReview {
  // uuid: string 
  providerName: string
  conditionName: string
  diagnosisCategory: string
  conditionDetail: string
}

interface IPertinentCondition {
  conditionName: string
  diagnosisCategory: string
  conditionDetail: string
}

export interface IConditionsByProvider {
  [key: string]: IPertinentCondition
}

export interface IFormValues { 
  [key: string]: string
}

interface IChartReviewProps {
  customer: string
}

interface IChartReviewState {
  providerConditions: IProviderReview[]
  conditionsByProvider: IConditionsByProvider
  diagnosisCategorySelectOptions: string[]
  dynamicSelectOptions: IDynamicSelectOptions
  formValues: IFormValues 
  groupUnderReview: string
  groups: IGroups
  underReview: boolean 
}

export class ChartReview extends React.Component<IChartReviewProps, IChartReviewState> { 
  public readonly state: IChartReviewState = {
    conditionsByProvider: {},
    diagnosisCategorySelectOptions: [],
    dynamicSelectOptions: {
      conditions: [],
      providers: []
    }, 
    formValues: {}, 
    groupUnderReview: "",
    groups: {},
    providerConditions: [],
    underReview: false
  }
  
  public componentDidMount() {
    this.setState({diagnosisCategorySelectOptions: readModel[this.props.customer].diagnosisCategorySelectOptions})
    this.setState({groups: readModel[this.props.customer].groups})
  }
  
  public render() {
    return (
      <div>
      {! this.state.underReview && (
        <ChartReviewForm
          customer={this.props.customer}
          diagnosisCategorySelectOptions={this.state.diagnosisCategorySelectOptions}
          dynamicSelectOptions={this.state.dynamicSelectOptions}
          groupUnderReview={this.state.groupUnderReview} 
          groups={this.state.groups}
          providerConditions={this.state.providerConditions}
          handleAddProvider={this.handleAddProvider} 
          handleChange={this.handleChange}
          handleProviderReviewChange={this.handleProviderReviewChange}
          handleRemoveProvider={this.handleRemoveProvider}
          handleReview={this.handleReview} 
        />
      )}
      { this.state.underReview && (
        <ChartReviewSummaryForm
          customer={this.props.customer} 
          diagnosisCategorySelectOptions={this.state.diagnosisCategorySelectOptions} 
          dynamicSelectOptions={this.state.dynamicSelectOptions} 
          formValues={this.state.formValues} 
          groupUnderReview={this.state.groupUnderReview}
          groups={this.state.groups}
          handleChange={this.handleChange}
          handleProviderReviewChange={this.handleProviderReviewChange}
          handleRemoveProvider={this.handleRemoveProvider}
          handleAddProvider={this.handleAddProvider}
          handleReview={this.handleReview}
          providerConditions={this.state.providerConditions}
        />
      )}
      </div>
    )}
  
    private handleChange = (evt: any) => {
    const newState = this.state
    newState.formValues[evt.target.name] = evt.target.value
    if (evt.target.name === 'groupUnderReview' && newState.groups[evt.target.value] != null) {
      newState.dynamicSelectOptions = newState.groups[evt.target.value].selectOptions
    }
    this.setState(newState)  
  }
  
  private handleReview = () => {
    const newState = this.state
    newState.underReview = true
    this.setState(newState)
  }
  
  private handleProviderReviewChange = (idx: number) => (evt: any) => {
    const newProviders = this.state.providerConditions.map((provider, sidx) => {
      if (idx !== sidx) { return provider }
      return { ...provider, [evt.target.name]: evt.target.value }
    })
    this.setState({ providerConditions: newProviders })
  }
  
  private handleAddProvider = () => {
    this.setState( (previousState, props) => {
      // const uniqueId: string = uuidv1()
      // return {providerConditions: previousState.providerConditions.concat([{ uuid: uniqueId, providerName: '', conditionName: '', diagnosisCategory: '', conditionDetail: '' }])}
      return {providerConditions: previousState.providerConditions.concat([{ providerName: '', conditionName: '', diagnosisCategory: '', conditionDetail: '' }])}
    })
  }

  private handleRemoveProvider = (idx: number) => () => {
    this.setState({
      providerConditions: this.state.providerConditions.filter((s, sidx) => idx !== sidx)
    })
  }

}