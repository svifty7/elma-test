import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

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
        },
        modalDefault: {
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

            state.tasks.forEach(task => {
                let updatedWatchers = [];

                task.watchers.forEach(watcher => {
                    let user = state.users.find(user => user.id === watcher);

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

            state.users.forEach(user => {
                let tasksResult = [];

                user.tasks.forEach(item => {
                    tasksResult.push(state.tasks.find(task => task.id === item || task.id === item.id));
                });
                user.tasks = tasksResult;
                result.push(user);
            });

            commit('setResult', result);
        },

        updateSortedTasks: ({commit, state}, payload) => {
            let newResult = [];

            state.result.forEach(user => {
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

            state.users.forEach(user => {
                if (user.id !== payload) {
                    updatedUsers.push(user);
                }
            });

            commit('changeUsers', updatedUsers);

            state.tasks.forEach(task => {
                let updatedWatchers = [];

                task.watchers.forEach(watcher => {

                    if (watcher.id !== payload) {
                        let user = state.users.find(user => user.id === watcher.id);

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
            let modalData = state.modal;

            if (typeof payload === "string" && payload === "close") {
                modalData = state.modalDefault;
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

            state.tasks.forEach(task => {
                if (task.id !== payload) {
                    updatedTasks.push(task);
                }
            });

            commit("changeTasks", updatedTasks);

            state.users.forEach(user => {
                let updatedUserTasks = [];

                user.tasks.forEach(task => {
                    if (task.id !== payload) {
                        updatedUserTasks.push(task)
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
        }
    },
    getters: {
        getResult: state => {
            return state.result;
        },

        getModalData: state => {
            return state.modal;
        }
    }
})

export default store;
