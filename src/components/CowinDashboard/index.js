// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'IN_PROCESS',
}

class CowinDashboard extends Component {
  state = {vaccinationData: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState = {apiStatus: apiStatusConstants.inProcess}
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachData => ({
          vaccineDate: eachData.vaccine_date,
          dose1: eachData.dose_1,
          dose2: eachData.dost_2,
        })),

        vaccinationByAge: data.vaccination_by_age.map(eachAgeData => ({
          age: eachAgeData.age,
          count: eachAgeData.count,
        })),

        vaccinationByGender: data.vaccination_by_gender.map(eachGenderData => ({
          count: eachGenderData.count,
          gender: eachGenderData.gender,
        })),
      }
      this.setState = {
        vaccinationData: updatedData,
        apiStatus: apiStatusConstants.success,
      }
    } else {
      this.setState = {apiStatus: apiStatusConstants.failure}
    }
  }

  renderVaccinationStats = () => {
    const {vaccinationData} = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div className="loading-view" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderViewBasedOnApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationStats()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProcess:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-dashboard-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              className="logo"
              alt="website logo"
            />
            <h1 className="logo-heading">Cp-WIN</h1>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderViewBasedOnApiStatus()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
