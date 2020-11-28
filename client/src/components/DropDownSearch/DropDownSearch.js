import Axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import { addTag, removeTag, logout } from "../../actions/index";

class DropdownExampleSearchDropdown extends Component {
  state = {
    options: [],
  };
  handle = async (e, data) => {
    console.log(data.searchQuery);
    let body = {
      value: data.searchQuery,
      currentUser: {
        user_id: this.props.user.userId,
      },
    };

    try {
      const res = await Axios.post(
        "https://powerful-coast-07208.herokuapp.com/api/tags/search_tag",
        body
      );

      const updatedOptions = [];

      res.data.data.map((tag) => {
        updatedOptions.push({
          key: tag.tag,
          text: tag.tag,
          value: tag.tag,
        });
      });

      res.data.userData.map((tags) => {
        updatedOptions.push({
          key: tags._id.tags,
          text: tags._id.tags,
          value: tags._id.tags,
        });
      });

      this.setState({ options: updatedOptions });
    } catch (Err) {
      console.log(Err);
    }
  };

  handleSelectTag = (e, data) => {
    this.props.addTag(data.value);
  };
  render() {
    return (
      <Dropdown
        button
        className="icon"
        floating
        labeled
        icon="dropdown"
        options={this.state.options}
        search
        onChange={this.handleSelectTag}
        onSearchChange={this.handle}
        text="Select Tags"
      />
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  applyTags: state.applyTags,
});

export default connect(mapStateToProps, { addTag })(
  DropdownExampleSearchDropdown
);
