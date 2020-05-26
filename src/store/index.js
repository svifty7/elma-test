import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import {deepCopy} from "@/helpers/deep-copy";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        tasks: [],
        users: [],
        result: [],
        modal: {
            visible: false,
            name: undefined,
            params: {}
        }
    },
    mutations: {
        changeUsers: (state, payload) => {
            state.users = payload
        },

        changeTasks: (state, payload) => {
            state.tasks = payload
        },

        setResult: (state, payload) => {
            const payloadString = JSON.stringify(payload);

            state.result = payload;

            localStorage.setItem('users', payloadString);
        },

        changeModal: (state, payload) => {
            state.modal = payload;
        }
    },
    actions: {
        getData: ({commit, dispatch}) => {
            const storageData = JSON.parse(localStorage.getItem('users'));
            const locationParams = window.location.search.replace("?", "").split(";");

            let locationParamsFormatted = {};

            locationParams.forEach(el => {
                locationParamsFormatted[el.split("=")[0]] = el.split("=")[1];
            });

            if (storageData && storageData.length && locationParamsFormatted["reset"] != "true") {
                commit('setResult', storageData);
            } else {
                dispatch('getUsers')
            }
        },

        getUsers: context => {
            axios
                .get('/json/users.json')
                .then(response => {
                    context.commit('changeUsers', response.data);
                    store.dispatch('getTasks')
                })
                .catch(error => {
                    context.commit('changeUsers', []);
                    console.log(error)
                });
        },

        getTasks: context => {
            axios
                .get('/json/tasks.json')
                .then(response => {
                    context.commit('changeTasks', response.data);
                    store.dispatch('updateTasksWatchers')
                })
                .catch(error => {
                    context.commit('changeTasks', []);
                    console.log(error)
                });
        },

        updateTasksWatchers: ({commit, state, dispatch}) => {
            let updatedTasks = [];
            let users = deepCopy(state.users);
            let tasks = deepCopy(state.tasks);

            tasks.forEach(task => {
                let updatedWatchers = [];

                task.watchers.forEach(watcher => {
                    let user = users.find(user => user.id === watcher);

                    updatedWatchers.push({
                        id: user.id,
                        name: user.first_name + ' ' + user.last_name,
                        image: user.image
                    });
                });

                task.watchers = updatedWatchers;
                updatedTasks.push(task);
            });

            commit('changeTasks', updatedTasks);
            dispatch('splitData');
        },

        splitData: ({commit, state}) => {
            let result = [];
            let users = deepCopy(state.users);
            let tasks = deepCopy(state.tasks);

            users.forEach(user => {
                let tasksResult = [];

                user.tasks.forEach(item => {
                    let userTask = tasks.find(task => task.id === item || task.id === item.id);

                    userTask.responsible = user.id;

                    tasksResult.push(userTask);
                });

                user.name = user.first_name + " " + user.last_name;
                user.tasks = tasksResult;
                result.push(user);
            });

            commit('setResult', result);
        },

        updateSortedTasks: ({commit, state}, payload) => {
            let result = deepCopy(state.result);
            let newResult = [];

            result.forEach(user => {
                if (user.id === payload.userId) {
                    user.tasks = payload.sortedTasks;
                }

                newResult.push(user);
            });

            commit('setResult', newResult);
        },

        removeUser: ({commit, state, dispatch}, payload) => {
            let updatedUsers = [];
            let updatedTasks = [];
            let users = deepCopy(state.users);
            let tasks = deepCopy(state.tasks);

            users.forEach(user => {
                if (user.id !== payload) {
                    updatedUsers.push(user);
                }
            });

            commit('changeUsers', updatedUsers);

            tasks.forEach(task => {
                let updatedWatchers = [];

                task.watchers.forEach(watcher => {

                    if (watcher.id !== payload) {
                        let user = users.find(user => user.id === watcher.id);

                        updatedWatchers.push({
                            id: user.id,
                            name: user.first_name + ' ' + user.last_name,
                            image: user.image
                        });
                    }
                });

                task.watchers = updatedWatchers;
                updatedTasks.push(task);
            });

            commit('changeTasks', updatedTasks);
            dispatch('splitData')
        },

        toggleModal: ({state, commit}, payload) => {
            let modalData = deepCopy(state.modal);

            if (typeof payload === "string" && payload === "close") {
                modalData = {
                    visible: false,
                    name: undefined,
                    params: {}
                };
            } else if (typeof payload === "object" && typeof payload.type === "string") {
                modalData = {
                    visible: true,
                    type: payload.type,
                    params: payload.params
                }
            } else if (typeof payload === "string") {
                modalData = {
                    ...modalData,
                    visible: true,
                    type: payload
                }
            } else {
                throw new Error("Modal type is not defined");
            }

            commit('changeModal', modalData);
        },

        removeTask: ({state, dispatch, commit}, payload) => {
            let updatedTasks = [];
            let updatedUsers = [];
            let users = deepCopy(state.users);
            let tasks = deepCopy(state.tasks);

            tasks.forEach(task => {
                if (task.id !== payload) {
                    updatedTasks.push(task);
                }
            });

            commit("changeTasks", updatedTasks);

            users.forEach(user => {
                let updatedUserTasks = [];

                user.tasks.forEach(taskID => {
                    if (taskID !== payload) {
                        updatedUserTasks.push(taskID)
                    }
                });

                user.tasks = updatedUserTasks;
                updatedUsers.push(user);
            });

            commit("changeUsers", updatedUsers)

            dispatch("splitData");
            dispatch("toggleModal", "close");
        },

        createUser: ({state, commit, dispatch}, payload) => {
            const userInfo = {
                ...payload,
                id: state.users.length + 1,
                tasks: [],
            };

            let updatedUsers = state.users;

            updatedUsers.push(userInfo);

            commit("changeUsers", updatedUsers);
            dispatch("splitData");
            dispatch("toggleModal", "close");
        },

        pushTask: ({state, commit, dispatch}, payload) => {
            let tasks = deepCopy(state.tasks);
            let users = deepCopy(state.users);
            let task = {
                ...payload,
                date: new Date().toISOString(),
            };

            if (Array.isArray(task.watchers)) {
                task.watchers.forEach((watcher, index) => {
                    task.watchers[index] = watcher.id
                });
            }

            tasks.forEach((taskItem, taskIndex) => {
                taskItem.watchers.forEach((watcher, watcherIndex) => {
                    tasks[taskIndex].watchers[watcherIndex] = watcher.id
                });
            });

            users.forEach((user, userIndex) => {
                user.tasks.forEach((taskItem, taskIndex) => {
                    users[userIndex].tasks[taskIndex] = taskItem.id
                });

                if (user.id === task.responsible.id) {
                    users[userIndex].tasks.push(task.id);
                }
            });

            console.log(task)

            tasks.push(task);
            commit("changeTasks", tasks);
            commit("changeUsers", users);
            dispatch("updateTasksWatchers").then(() => {
                dispatch("splitData").then(() => {
                    dispatch("toggleModal", "close");
                })
            })
        }
    },
    getters: {
        getResult: state => {
            return deepCopy(state.result);
        },

        getModalData: state => {
            return deepCopy(state.modal);
        },

        getTasks: state => {
            return deepCopy(state.tasks);
        }
    }
})

export default store;
