import React, { Component } from "react";
import { FormControl, Button } from "react-bootstrap";
import searchIcon from "../../../res/search.svg";

let filterInput = (searchLine, userList, defaultUser) => {
    let newListModel;
    // Если строка пустая, то следует вернуть список рутовых юзеров
    if (searchLine === "") {
        newListModel = userList.filter(user => user.root);

        // Если список юзеров пустой, то вернуть дефолтного юзера
        if (newListModel.length === 0) {
            return [defaultUser];
        }
        return newListModel;
    }

    let re = /https:\/\/vk.com\/.+.*/;

    if (re.test(searchLine)) {
        return [{
            "id": 0,
            "label": "New User",
            "color": "",
            "image": "https://vk.com/images/camera_200.png?ava=1",
            "root": false
        }]
    }

    return userList.filter(user => user.label.toLowerCase().includes(searchLine.toLowerCase()));
};

class SearchModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchLine: "",
            collapsed: this.props.collapsed
        };
    }

    searchInputHandler = (event) => {
        const value = event.target.value;
        const newListModel = filterInput(value, this.state.userList, this.state.defaultUser);
        this.props.updateListHandler(newListModel);
        this.setState({ searchLine: value });
    }

    static getDerivedStateFromProps(props, state) {
        const delta = {};

        if (props.collapsed !== state.collapsed)
            delta.collapsed = props.collapsed;

        delta.listModel = filterInput(state.searchLine, props.userList, props.defaultUser);
        delta.userList = props.userList;
        delta.defaultUser = props.defaultUser;

        if (delta) return delta;
        return false;
    }

    render() {
        return this.state.collapsed ?
            (<>
                <Button
                    onClick={this.props.showButtonClickHandler}
                    variant="sidebar-light">
                    <img
                        alt="search"
                        src={searchIcon}
                        width="30"
                        height="34"
                        className="mt-1 mb-1"
                    />
                </Button>
            </>)
            : (< FormControl
                onChange={this.searchInputHandler}
                className="m-2 w-auto"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={this.state.searchLine}
            />)
    }
}


export { SearchModule, filterInput };