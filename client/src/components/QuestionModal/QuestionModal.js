import React, { Component } from "react";
import { Button, Icon, Image, Modal, Form, TextArea } from "semantic-ui-react";
import "./QuestionModal.css";
import axios from "axios";
import { connect } from "react-redux";

class QuestionModal extends Component {
  state = {
    open: false,
    tags: this.props.problem.tags,
    tagNameToAdd: "",
    userDefinedTags: [],
  };

  addTag = async () => {
    let add = true;
    const { tagNameToAdd, tags } = this.state;
    if (tagNameToAdd === "" || tags.indexOf(tagNameToAdd) != -1) {
      add = false;
    }

    if (add) {
      let body = {
        tagName: tagNameToAdd,
        problemId: this.props.problem._id,
      };

      this.setState((prevState) => ({
        userDefinedTags: [...prevState.userDefinedTags, prevState.tagNameToAdd],
        tagNameToAdd: "",
      }));

      try {
        const res = await axios.post("https://powerful-coast-07208.herokuapp.com/api/tags", body, {
          headers: {
            authorization: this.props.user.token,
          },
        });

      } catch (err) {
        console.log(err);
      }
    }
  };

  getTags = async () => {
    try {
      let body = {
        user_id: this.props.user.userId,
      };
      const res = await axios.post(
        "https://powerful-coast-07208.herokuapp.com/api/problem/problem/" + this.props.problem._id,
        body
      );

      if ("tags" in res.data) {
        this.setState((prevState) => ({
          userDefinedTags: [...res.data.tags, ...prevState.userDefinedTags],
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = (event) => {
    this.setState({
      tagNameToAdd: event.target.value.toLowerCase(),
    });
  };

  async componentDidMount() {
    this.getTags();
  }

  render() {
    const { tags, open, tagNameToAdd, userDefinedTags } = this.state;

    return (
      <Modal
        open={open}
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        trigger={<Button>Show</Button>}
      >
        <Modal.Header>{this.props.problem.problemCode}</Modal.Header>
        <Modal.Content image scrolling>
          <div
            dangerouslySetInnerHTML={{
              __html: this.props.problem.body,
            }}
          ></div>
        </Modal.Content>

        <Modal.Content scrolling>
          {userDefinedTags.map((tag, i) => (
            <Button key={i} primary className="TagButton">
              {tag}
            </Button>
          ))}
        </Modal.Content>

        {this.props.user.token !== null ? (
          <Modal.Content scrolling>
            <Form className="Form">
              <TextArea
                rows={1}
                placeholder="Add another tag"
                onChange={this.handleChange}
                value={tagNameToAdd}
              />
            </Form>
            <Button secondary onClick={this.addTag}>
              Add Tag
            </Button>
          </Modal.Content>
        ) : null}
        <Modal.Actions>
          <Button onClick={() => this.setState({ open: false })} primary>
            Hide Problem
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  applyTags: state.applyTags,
});
export default connect(mapStateToProps)(QuestionModal);
