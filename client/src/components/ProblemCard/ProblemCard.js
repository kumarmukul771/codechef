import React, { Component } from "react";
import "./ProblemCard.css";
import { Item, Grid, Card, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import axios from "axios";
import QuestionModal from "../QuestionModal/QuestionModal";
import { Link } from "react-router-dom";

class ProblemCard extends Component {
  state = {
    problems: [],
    loading: true,
    error: false,
  };

  render() {
    const { problem } = this.props;
    return (
      // <div className="Cards">
      <Card raised>
        <Card.Content header={problem.problemCode} />
        <Card.Content description={problem.problemName} />
        {/* <Card.Content extra>
          <Icon name="user" />4 Problems
        </Card.Content> */}
        <Card.Content extra>
          <QuestionModal problem={problem} />
        </Card.Content>
      </Card>
      //   </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  applyTags: state.applyTags,
});
export default connect(mapStateToProps)(ProblemCard);
