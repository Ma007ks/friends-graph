import { users_get, friends_get, vkscript_execute, createProfileByData } from "../../api/Friends";
import { Component } from "react";

class Userable extends Component {
  constructor(props) {
    super(props);
    // нужен для хранения пользователей
    this.users = [];

    this.state = {
      users: [], // нужен для отображения
      relations: [],
      aggregators: false
    };
  }

  /*
      Добавляет рутового юзера
    */
  async addRootUser(id) {
    let userPresents = this.isUserPresentWithId(id);
    let user;

    if (!userPresents) {
      user = await this.createProfileById(id);
      user.hidden = false;
      this.addUser(user);
    }
    else {
      user = userPresents;
    }


    this.changeToRoot(user);
  }

  /*
        Меняет тип юзера на рутовый и добавляет всех его друзей
    */
  async changeToRoot(rootUser) {
    // Проверка, если юзер уже рутовый
    if (rootUser.root) {
      return;
    }
    rootUser.root = true;

    // не реализовано
    //if (rootUser.isClosed) return;

    let friends = await friends_get(rootUser.id);

    friends = friends.map(friend => {
      let res = createProfileByData(friend);
      // не загружать сразу
      res.hidden_image = res.image;
      res.image = '';
      res.hidden = true;
      return res;
    });

    this.addUserList(friends);

    this.setAmountOfFriends(rootUser, friends.length);
    await this.addUserRelationsWithProfiles(rootUser, friends);
    await this.connectFriends(friends);
  }

  addUser(profile) {
    if (profile && !this.isUserPresentWithId(profile.id)) {
      this.users.push(profile);
      this.setState({ users: this.users });
      return true;
    }
    return false;
  }

  addUserList(profiles) {
    const res = profiles.filter(e => e && !this.isUserPresentWithId(e.id));
    this.users.push(...res);
    this.setState({ users: this.users });
    return true;
  }

  setProfileVisibility(profile, value, notHideIfShown) {
    if (!profile.hidden && notHideIfShown)
      return;
    profile.hidden = !value;
  }

  setAmountOfFriends(profile, amount) {
    profile.f_amount = amount;
  }

  setAmountOfMutualFriends(profile, amount) {
    profile.mf_amount = amount;
  }

  /*
        Соединяет друзей между собой и добавленными юзерами 
    */
  async connectFriends(friends) {
    for (let index = 0; index < friends.length; index += 25) {
      const lastIndex = Math.min(friends.length, index + 25);
      let requestedUsers = friends.slice(index, lastIndex);
      let usersPayload = requestedUsers.map(elem => {
        return `{id: ${elem.id},rels: API.friends.get({user_id: ${elem.id}})}`;
      });

      let respond = await vkscript_execute(`return [${usersPayload}];`);
      for (let n = 0; n < respond.length; n++) {
        let relations = respond[n].rels.items;
        if (relations && relations.length > 0) {
          this.setAmountOfFriends(
            friends[index + n],
            relations.length
          );
          await this.addUserRelationsWithIds(
            friends[index + n],
            relations
          );
        }
      }
    }
  }

  /*
        Добавляет связи между текущим пользователем и теми, кто
        уже добавлен в users.
    
        Также, можно передать список id друзей через параметр friends. 
    */
  async addUserRelations(profile, friends) {
    if (typeof friends !== 'undefined' && !friends.length)
      return true;

    friends = friends || [];
    if (!friends.length) {
      friends = await friends_get(profile.id, true);
      if (!friends.length) return false;
    }

    let new_relations = friends
      .filter(n => this.users.some(e => e.id === n))
      .map(n =>
        profile.id < n
          ? { from: profile.id, to: n }
          : { from: n, to: profile.id }
      )
      .filter(rel => !this.isRelationPresent(rel));

    this.setAmountOfMutualFriends(profile, new_relations.length);

    if (!this.state.aggregators && this.isAggregator(profile)) {
      this.removeUser(profile);
    }

    this.setProfileVisibility(profile, true);
    this.addRelations(new_relations);
    return true;
  }

  addRelations(relations) {
    this.setState({ relations: this.state.relations.concat(relations) });
  }

  /*
        Тоже, что и addUserRelations, но параметр friends принимает профили.
    */
  async addUserRelationsWithProfiles(profile, friends) {
    friends = friends || [];
    if (friends.length) {
      friends = friends.map(elem => elem.id);
    }
    await this.addUserRelations(profile, friends);
  }

  /*
        Тоже, что и addUserRelations.
    */
  async addUserRelationsWithIds(profile, friends) {
    await this.addUserRelations(profile, friends);
  }

  isRelationPresent(relation) {
    for (const anotherRelation of this.state.relations)
      if (
        relation.from === anotherRelation.from &&
        relation.to === anotherRelation.to
      ) {
        return true;
      }
    return false;
  }
  /*
        Возвращает профиль юзера, если
        соответствующий был найден
    */
  isUserPresentWithId(userId) {
    for (const anotherUser of this.users)
      if (userId === anotherUser.id) {
        return anotherUser;
      }
    return false;
  }

  removeUser(profile) {
    if (profile && profile.id) {
      this.users = this.users.filter(s => s.id !== profile.id);
      this.setState({
        users: this.users
      });
      return true;
    }
    return false;
  }

  async createProfileById(id) {
    let data = await users_get([id]);
    data = data[0];
    if (
      !this.users.some(
        element => data === undefined || element.id === data.id
      )
    ) {
      return createProfileByData(data);
    }
    return {
      "id": -100,
      "label": "Not Loaded",
      "color": "",
      "image": "https://vk.com/images/camera_200.png?ava=1",
      "root": false
    }
  }

  useAggregators(value) {
    this.setState({ aggregators: value });
  }

  isAggregator(profile) {
    if (profile.root) {
      return false;
    }
    if (profile.f_amount < 190 || profile.mf_amount > 5 && profile.mf_amount < 25) {
      return false;
    }
    return true;
  }


  clearUsers() {
    this.users = [];
    this.setState({ users: this.users });
  }

  render() {
    return this.props.children(
      this.state.users,
      this.state.relations,
      this.addRootUser.bind(this),
      this.addUser.bind(this),
      this.removeUser.bind(this),
      this.useAggregators.bind(this),
      this.clearUsers.bind(this)
    );
  }
}

export { Userable };
