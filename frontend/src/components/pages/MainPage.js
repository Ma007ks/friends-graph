import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { Sidebar } from "../view/Sidebar";
import { FriendsGraph as Graph } from "../view/Graph";
import { Grapharable } from "../containers/Grapharable";
import settingsIcon from "../../res/settings.svg";

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aggregators: false
        };
    }

    SettingsButton = (props) => {
        return <Dropdown alignRight drop='up' className="position-fixed" style={{ right: 25, bottom: 18 }}>
            <Dropdown.Toggle as={"img"} alt="settings" className="nutIcon" src={settingsIcon} />
            <Dropdown.Menu>
                <Dropdown.Header>Settings</Dropdown.Header>
                <Dropdown.Item onClick={() => {
                    props.useAggregators(!this.state.aggregators);
                    this.setState({ aggregators: !this.state.aggregators });
                }
                }>
                    {this.state.aggregators ? "Disable aggregators" : "Enable aggregators"}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => props.clearUsers()}>Clear graph</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>;
    };

    render() {
        return (
            <Grapharable>
                {(users, relations, addRootUser, addUser, removeUser, bindGraph, useAggregators, clearUsers) => {
                    return (
                        <div className="main d-flex">
                            <Graph
                                users={users}
                                relations={relations}
                                addRootUser={addRootUser}
                                bindGraph={bindGraph}
                            />
                            <Sidebar
                                mainUserId={this.props.mainUserId}
                                changeIsAuthorized={this.props.changeIsAuthorized}
                                userList={users}
                                addRootUser={addRootUser}
                                addUser={addUser}
                                removeUser={removeUser}
                            />
                            <this.SettingsButton
                                useAggregators={(value) => useAggregators(value)}
                                clearUsers={() => clearUsers()}
                            />
                        </div>
                    );
                }}
            </Grapharable>
        );
    }
}

export { MainPage };
