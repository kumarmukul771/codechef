import React, { Component } from "react";
import "./TagDetail.css";
import {
  Item,
  Grid,
  Card,
  Icon,
  Dimmer,
  Loader,
  Message,
} from "semantic-ui-react";
import { connect } from "react-redux";
import axios from "axios";
import ProblemCard from "../ProblemCard/ProblemCard";
import Header from "../Header/Header";
import { Link, Redirect } from "react-router-dom";
import {
  addTag,
  removeTag,
  removeAllTags,
  addAllTags,
  setUser,
  authCheckState,
  checkAuthTimeOut,
} from "../../actions/index";
import ApplyTagCard from "../ApplyTagCard/ApplyTagCard";

class TagDetail extends Component {
  state = {
    problems: [],
    loading: true,
    error: false,
    offset: 0,
    selectedTags: [],
  };
  async componentDidMount() {
    this.props.onTryAutoSignup();
    this.setState((prevState) => ({
      loading: false,
      selectedTags: this.props.applyTags.tags,
    }));
  }

  render() {
    const { loading, error, selectedTags } = this.state;
    const { problems } = this.props;
    if (loading) {
      return (
        <Grid>
          <Dimmer active>
            <Loader size="massive">Loading</Loader>
          </Dimmer>
        </Grid>
      );
    } else if (problems.length === 0) {
      return (
        <Grid>
          <Grid.Row>
            <Header link={1} applyTag={this.applyTag} />
          </Grid.Row>

          <Grid.Row>
            {this.props.applyTags.tags.map((tag, i) => (
              <ApplyTagCard key={i} tag={tag} />
            ))}
          </Grid.Row>

          {selectedTags.length === 0 ? (
            <Grid.Row className="message">
              <Message negative>
                <Message.Header>No tags selected.</Message.Header>
              </Message>
            </Grid.Row>
          ) : (
            <Grid.Row className="message">
              <Message positive>
                <Message.Header>Selected Tags :</Message.Header>

                {selectedTags.map((tag,i) => (
                  <p key={i}>{tag}</p>
                ))}
              </Message>
            </Grid.Row>
          )}

          <Grid.Row className="message">
            <Message negative>
              <Message.Header>
                We're sorry we couldn't fetch problems with these tags.
              </Message.Header>
              <p>No problems found.</p>
              <Link to="/">Return to home page.</Link>
            </Message>
          </Grid.Row>
        </Grid>
      );
    }
    return (
      <Grid>
        <Grid.Row>
          <Header link={1} />
        </Grid.Row>
        <Grid.Row>
          <Grid divided="vertically" className="Tags" columns={3} celled>
            {/* ================================================================ */}
            {/* ======================== Difficulty ============================ */}
            {/* ================================================================ */}
            <Grid.Row>
              {this.props.applyTags.tags.map((tag, i) => (
                <ApplyTagCard key={i} tag={tag} />
              ))}
            </Grid.Row>
            {selectedTags.length === 0 ? (
              <Grid.Row className="message">
                <Message negative>
                  <Message.Header>No tags selected.</Message.Header>
                </Message>
              </Grid.Row>
            ) : (
              <Grid.Row className="message">
                <Message positive>
                  <Message.Header>Selected Tags :</Message.Header>

                  {selectedTags.map((tag, i) => (
                    <p key={i}>{tag}</p>
                  ))}
                </Message>
              </Grid.Row>
            )}

            <Grid.Row>
              {problems.map((problem, i) => (
                <Grid.Column key={i} className="GridCard">
                  <ProblemCard problem={problem} />
                </Grid.Column>
              ))}
            </Grid.Row>

            {/* ================================================================ */}
            {/* ================================================================ */}
            {/* ================================================================ */}
          </Grid>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  applyTags: state.applyTags,
  problems: state.problems.problems,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(authCheckState()),
    onRemoveAllTags: () => dispatch(removeAllTags()),
    check: () => dispatch(checkAuthTimeOut()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TagDetail);
