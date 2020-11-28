import React, { Component } from "react";
import { Card, Icon, Checkbox, Item } from "semantic-ui-react";
import "./TagCard.css";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { addTag, removeTag } from "../../actions/index";

class TagCard extends Component {
  handleChange = (e, { checked }) => {
    let tag = this.props.tag;
    if (checked) {
      this.props.addTag(tag);
    } else {
      this.props.removeTag(tag);
    }
  };

  render() {
    let checked = false;
    if (this.props.applyTags.tags.indexOf(this.props.tag) != -1) {
      checked = true;
    }

    return (
      <Card
        centered
        color="grey"
        raised={true}
        className="Card"
      >
        <Checkbox onChange={this.handleChange} checked={checked} />
        <Card.Content header={this.props.tag} />
        <Card.Content extra>
          <Icon name="user" />
          {this.props.count} Problems
        </Card.Content>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  applyTags: state.applyTags,
});
export default connect(mapStateToProps, { addTag, removeTag })(
  withRouter(TagCard)
);
