import React, { Component } from "react";
import { Search, Grid, Dropdown, Button } from "semantic-ui-react";
import "./Header.css";
import { withRouter, Redirect } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import {
  addTag,
  removeTag,
  logout,
  addProblemToSelectedTag,
} from "../../actions/index";
import DropdownSearch from "../DropDownSearch/DropDownSearch";

class Header extends Component {
  state = {
    stateOptions: [],
    selected: [],
    selections: 0,
  };

  componentDidMount() {
    console.log(this.props.applyTags);
    let val = this.props.applyTags.allTags.map((state, i) => ({
      key: state.tag,
      text: state.tag,
      value: state.tag,
    }));

    this.setState({
      stateOptions: val,
    });
  }

  handleChange = (e, data) => {
    console.log(data);
    this.props.addTag(data.value.pop());
  };

  // data = async () => {
  //   let res = await axios.get("http://localhost:8081/api/problem");

  //   console.log(res);
  //   // return;

  //   const AuthStr = "Bearer " + "ce7bd250e750db578ea8b1335a838defb6b5911e";
  //   let v = 245;

  //   var tt = setInterval(async () => {
  //     for (let i = v; i <= v + 30; i++) {
  //       some(i);
  //       console.log("Going for document", i);
  //       try {
  //         const response = await axios.get(
  //           "https://api.codechef.com/contests/PRACTICE/problems/" +
  //             res.data[i].problemCode,
  //           {
  //             headers: { Authorization: AuthStr },
  //           }
  //         );

  //         let body = response.data.result.data.content;
  //         body = { ...body, accuracy: res.data[i].accuracy };

  //         console.log("Trying to send", body);

  //         let resp = await axios.post(
  //           "http://localhost:8081/api/problem/hard",
  //           body
  //         );
  //         console.log("Successfully done", resp);
  //         console.log("Done", i);
  //       } catch (err) {
  //         console.log(i);
  //       }
  //     }
  //     v += 31;
  //   }, 305000);

  //   const some = (i) => {
  //     if (i == 3000) clearInterval(tt);
  //   };
  // };

  applyTags = () => {
    this.props.onAddProblem();
      this.props.history.push("tagDetail");
    // this.data();
    
  };

  logout = () => {
    this.props.onLogout();
  };

  render() {
    const { stateOptions } = this.state;

    return (
      <Grid columns={2} divided className="Header">
        <Grid.Row divided>
          <Grid.Column>
            <DropdownSearch />
          </Grid.Column>

          <Grid.Column className="Buttons" floated="right" width={5}>
            <Grid columns={3} divided>
              <Grid.Column>
                <Button
                  inverted
                  color="green"
                  className="Button"
                  onClick={this.applyTags}
                >
                  Apply Tags
                </Button>
              </Grid.Column>

              {this.props.link === 0 ? null : (
                <Grid.Column>
                  <Button
                    inverted
                    color="green"
                    className="Button"
                    onClick={() => this.props.history.push("/")}
                  >
                    Home
                  </Button>
                </Grid.Column>
              )}

              {this.props.user.token === null ? (
                <Grid.Row>
                  <Grid.Column>
                    <Button
                      inverted
                      color="teal"
                      className="Button"
                      onClick={() => this.props.history.push("/login")}
                    >
                      Login
                    </Button>
                  </Grid.Column>

                  <Grid.Column>
                    <Button
                      inverted
                      color="red"
                      className="Button"
                      onClick={() => this.props.history.push("register")}
                    >
                      Sign Up
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              ) : (
                <Grid.Column>
                  <Button
                    inverted
                    color="teal"
                    className="Button"
                    onClick={this.logout}
                  >
                    Logout {this.props.user.username}
                  </Button>
                </Grid.Column>
              )}
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  applyTags: state.applyTags,
});
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout()),
    addTag,
    removeTag,
    onAddProblem: () => dispatch(addProblemToSelectedTag()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
