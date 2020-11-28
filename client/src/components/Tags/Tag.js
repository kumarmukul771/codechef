import React, { Component } from "react";
import "./Tag.css";
import { Grid, Card, Item, Segment } from "semantic-ui-react";
import { connect } from "react-redux";
import TagCard from "../TagCard/TagCard";
import { withRouter, Redirect } from "react-router-dom";
import { addAllTags } from "../../actions/index";
import Axios from 'axios';

class Tag extends Component {
  // fetchTags = async () => {
  //   try {
  //     const res = await Axios.get("http://localhost:8081/api/tags/allTags");
  //     console.log(res.data);
  //     this.props.addAllTags(res.data);
  //     this.setState({ allTagsLoading: false });
  //   } catch (err) {
  //     console.log(err);
  //     this.setState({ allTagsLoading: false });
  //   }
  // };

  async componentDidMount() {
    // this.fetchTags();
  }
  render() {
    console.log(this.props.tags);
    return (
      <Grid columns={3} divided className="Tag">
        {/* ================================================================ */}
        {/* ================================================================ */}
        {/* ================================================================ */}
        <Grid.Row>
          <Segment>
            <Item.Group divided>
              <Item>
                <Item.Image
                  size="tiny"
                  src={this.props.image}
                  className="Item"
                />

                <Item.Content verticalAlign="middle">
                  <Item.Header as="a">{this.props.content}</Item.Header>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Grid.Row>
        {/* ================================================================ */}
        {/* ================================================================ */}
        {/* ================================================================ */}

        {/* ================================================================ */}
        {/* ======================== Difficulty ============================ */}
        {/* ================================================================ */}

        <Grid.Row>
          {this.props.tags.map((tag, i) => {
            let checked = false;
            if (this.props.applyTags.tags.indexOf(this.props.tag) != -1)
              checked = true;

            return (
              <Grid.Column key={i}>
                <TagCard tag={tag} checked />
              </Grid.Column>
            );
          })}
        </Grid.Row>

        {/* ================================================================ */}
        {/* ================================================================ */}
        {/* ================================================================ */}
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  applyTags: state.applyTags,
});
export default connect(mapStateToProps, { addAllTags })(withRouter(Tag));
