import React, {Component} from "react";
import {Dropdown} from "react-bootstrap";
import {Sidebar} from "../view/Sidebar";
import {FriendsGraph as Graph} from "../view/Graph";
import {Grapharable} from "../containers/Grapharable";
import {createProfileById} from "../../api/Friends";
import settingsIcon from "../../res/settings.svg";

class MainPage extends Component {
    constructor() {
        super();
        this.state = {
            defaultUser: {
                "id": 0,
                "label": "Not loaded",
                "color": "",
                "image": "https://vk.com/images/camera_200.png?ava=1",
                "root": false
            },
            aggregators: false
        };
    }

    componentDidMount() {
        createProfileById(213966324).then(
            (profile) => profile && this.setState({defaultUser: profile})
        );
    }

    render() {
        return (
            <Grapharable>
                {(users, relations, addRootUser, removeUser, bindGraph) => {
                    return (
                        <div className="main d-flex">
                            <Graph
                                users={users}
                                relations={relations}
                                addRootUser={addRootUser}
                                bindGraph={bindGraph}
                            />
                            <Sidebar
                                changeIsAuthorized={this.props.changeIsAuthorized}
                                defaultUser={this.state.defaultUser}
                                userList={users}
                                addRootUser={addRootUser}
                                removeUser={removeUser}
                            />
                            <Dropdown alignRight  drop='up' className="position-fixed" style={{right:0, bottom:0}}>
                                <Dropdown.Toggle variant="transparent" >
                                    <img alt="settings" src={settingsIcon} width="30" height="30"/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => {this.setState({aggregators: !this.state.aggregators})}}>
                                            {this.state.aggregators ? "Disable aggregators" : "Enable aggregators"}
                                        </Dropdown.Item>
                                    <Dropdown.Item>Clear graph</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    );
                }}
            </Grapharable>
        );
    }
}

export {MainPage};
