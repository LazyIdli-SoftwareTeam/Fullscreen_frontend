import React from "react";
import ReactDOM from "react-dom";

export default class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      src: this.props.videos[0],
    };
  }

  componentDidMount() {
    let video = ReactDOM.findDOMNode(this);
    video.addEventListener("ended", (e) => {
      let nextIndex = (this.state.index + 1) % 2;
      this.setState({
        index: nextIndex,
        src: this.props.videos[nextIndex],
      });
    });
    video.play();
  }
  componentDidUpdate(prevProps, prevState) {
    let video = ReactDOM.findDOMNode(this);
    video.play();
  }
  render() {
    return (
      <video
        className="adds"
        src={this.state.src}
        autplay="true"
        muted
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
    );
  }
}
