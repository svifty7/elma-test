import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        tasks: [],
        users: [],
        result: [],
        sorted: []
    },
    mutations: {
        changeUsers: (state, payload) => {
            state.users = payload
        },

        changeTasks: (state, payload) => {
            state.tasks = payload
        },

        setResult: (state, payload) => {
            state.result = payload
        }
    },
    actions: {
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
                        name: user.first_name + " " + user.last_name,
                        image: user.image
                    });
                });

                task.watchers = updatedWatchers;
                updatedTasks.push(task);
            });

            commit("changeTasks", updatedTasks);
            dispatch('splitData');
        },

        splitData: ({commit, state}) => {
            let result = [];

            state.users.forEach(user => {
                let tasksResult = [];

                user.tasks.forEach(item => {
                    tasksResult.push(state.tasks.find(task => task.id === item));
                });

                user.tasks = tasksResult;
                result.push(user);
            });

            commit('setResult', result);
        }
    },
    getters: {
        getResult: state => {
            return state.result;
        },
    }
})

export default store;
