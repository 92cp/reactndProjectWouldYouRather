import React, { Component } from 'react'
import { Line } from 'rc-progress'
import { connect } from 'react-redux'
import NoMatch from '../components/NoMatch'

// show poll results
class PollResults extends Component {
  render () {
    const { user, question, totalVotes, yourAnswer, isInvalid } = this.props
    return (
      <div className="center top-10">
       {
        (isInvalid === false)
        ? (
        <div className="poll-card">
          <div className="poll-user"><h4>Results by {user.name} </h4></div>
          <div className="left">
            <img className="poll-card-avatar" alt={user.avatarURL} src={user.avatarURL} />
          </div>
          <div className="right">
            <b>Would You Rather...</b>
            <br/>
            <br/>
            <div className='border'>
              {question.optionOne.text}&nbsp;
               { yourAnswer !== undefined && yourAnswer[0][1] === "optionOne"
                ? <span>(your choice)</span>
                : null
              }<br />
              <br />
              <Line percent={(question.optionOne.votes.length/totalVotes)*100} strokeWidth="2" strokeColor="#f5d13a" />
              ({`${question.optionOne.votes.length} / ${totalVotes} votes`})
              <br />
            </div>
            <br />
            <div className='border'>
              {question.optionTwo.text}&nbsp;
              { yourAnswer !== undefined &&  yourAnswer[0][1] === "optionTwo"
                ? <span>(your choice)</span>
                : null
              }<br /><br />
              <br />
              <Line percent={(question.optionTwo.votes.length/totalVotes)*100} strokeWidth="2" strokeColor="#f5d13a" />
              ({`${question.optionTwo.votes.length} / ${totalVotes} votes`})
            <br />
            </div>
          </div>
        </div>)
        : <NoMatch />
      }
        <br/>
      </div>
    )
  }
}

function mapStateToProps ({questions, users, authedUser}, props) {

  const { id } = props.match.params
  const question = questions[id]

  if(typeof question === 'undefined'){
    return {
      isInvalid: true,
      user: '',
      question: ''
    }
  }

  const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length
  const userAnswers = users[authedUser].answers
  return {
    pollId: id,
    question,
    user: users[question.author],
    yourAnswer: Object.entries(userAnswers).filter((answer) => {
      return answer[0] === id
    }),
    totalVotes,
    isInvalid: false
  }
}

export default connect(mapStateToProps)(PollResults)