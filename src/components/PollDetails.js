import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { handleSaveAnswer } from '../actions/shared'
import NoMatch from '../components/NoMatch'

class PollDetails extends Component{

  state = {
    option: ''
  }


  handleChange = (event) => {
    this.setState({
      option: event.target.value
    })
  }

  handleVote = (event) => {
    const {dispatch, authedUser, pollId} = this.props
    const answer = this.state.option
    const qid = pollId
    dispatch(handleSaveAnswer({ authedUser, qid, answer }))
  }

  handleSetChoice = () => {
    const { userAnswer } = this.props
    if(userAnswer !== null)
      {this.setState({
        option: this.props.userAnswer
      })
    }
  }

  // set user past choice on component mount
  componentDidMount() {
     this.handleSetChoice()
  }

  // show indivual poll details.
  //user can select options and submit choice
  render(){
    const { user, question, isInvalid } = this.props
    return (
       <div className="center top-10">
       {
        (isInvalid === false)
        ? (<div className="poll-card">
            <div className="poll-user"><h4>{user.name} asks:</h4></div>
            <div className="left">
              <img className="poll-card-avatar" alt={user.avatarURL} src={user.avatarURL} />
            </div>
            <div className="right">
              <b>Would You Rather...</b>
              <br/>
              <br/>
              <form>
              <input
                type="radio"
                checked={this.state.option === "optionOne"}
                name="options"
                value="optionOne"
                onChange={this.handleChange} /> {question.optionOne.text}<br />
              <input
                type="radio"
                checked={this.state.option === "optionTwo"}
                name="options"
                value="optionTwo"
                onChange={this.handleChange}/> {question.optionTwo.text}<br />
              <br />
              </form>
            </div>
            <Link className='sign-in-button' to={`/results/${this.props.pollId}`} >
              <button onClick={this.handleVote} className="sign-in-button">Submit</button>
            </Link>
          </div>)
        : <NoMatch />
      }
        <br/>
      </div>

    )
  }
}


function mapStateToProps ({questions, users, authedUser}, props) {

  // get question id from address bar
  const { id } = props.match.params

  // get question from id
  const question = questions[id]

  if(typeof question === 'undefined'){
    return {
      isInvalid: true,
      user: '',
      question: ''
    }
  }

  const userAnswer = users[authedUser].answers[id]

  // return props to render a question
  return {
    pollId: id,
    question,
    user: users[question.author],
    authedUser,
    userAnswer,
    isInvalid: false
  }
}

export default connect(mapStateToProps)(PollDetails)