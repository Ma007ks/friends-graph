import React, { Component } from "react";
import bgVideo from "../../res/bg-video.mp4";

const VK = window.VK;

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWidget: false
    };
  }

  loadVkWidget = () => {
    VK.Widgets.Auth("vk-auth", {
      width: 'auto',
      onAuth: () => this.props.changeIsAuthorized()
    });
  };

  static getDerivedStateFromProps(props, state) {
    // Если состояние vkInit стало true и виджет не отображается
    if (props.vkInit && !state.showWidget) return { showWidget: true };
    return false;
  }

  render() {
    return (
      <div>
        <video id="bg-video" src={bgVideo} autoPlay="true" muted="true" loop="true" />
        <div className="login-content">
          <div id="vk-auth" className="position-fixed"/>
          {this.state.showWidget && this.loadVkWidget()}
        </div>
      </div>
    );
  }
}

export { LoginPage };
