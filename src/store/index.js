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
            type: undefined,
            params: {}
        }
    },
    mutations: {

        /**
         * Установка состояния списка пользователей.
         * Принимает массив с объектами пользователей.
         *
         * @param state
         * @param payload
         */
        changeUsers: (state, payload) => {
            state.users = payload
        },

        /**
         * Установка состояния списка задач.
         * Принимает массив с объектами задач.
         *
         * @param state
         * @param payload
         */
        changeTasks: (state, payload) => {
            state.tasks = payload
        },

        /**
         * Установка результатирующего состояния, откуда выводится информация на экран.
         *
         * @param state
         * @param payload
         */
        setResult: (state, payload) => {
            const payloadString = JSON.stringify(payload);

            state.result = payload;

            localStorage.setItem('users', payloadString);
        },

        /**
         * Изменение состояние модального окна.
         *
         * @param state
         * @param payload
         */
        changeModal: (state, payload) => {
            state.modal = payload;
        }
    },
    actions: {

        /**
         * Метод для определения источника, откуда будут запрашиваться данные для построения таблицы приложения.
         * Приоритетом источника является localStorage, если в localStorage нет строки с ключом "users", то данные
         * будут запрашиваться из файлов json методами getUsers & getTasks.
         *
         * Для сброса текущего состояния localStorage и запроса данных из файлов json: добавить к URL "/?reset=true"
         *
         * @param commit
         * @param dispatch
         */
        getData: ({commit, dispatch}) => {
            const storageData = JSON.parse(localStorage.getItem('users'));
            const locationParams = window.location.search.replace("?", "").split(";");

            let locationParamsFormatted = {};

            locationParams.forEach(el => {
                locationParamsFormatted[el.split("=")[0]] = el.split("=")[1];
            });

            if (storageData && storageData.length && locationParamsFormatted["reset"] != "true") {
                let tasks = [];

                storageData.forEach(user => {
                    user.tasks.forEach(task => {
                        tasks.push(task)
                    });
                });

                commit('changeUsers', storageData);
                commit('changeTasks', tasks);
                commit('setResult', storageData);
            } else {
                dispatch('getUsers')
            }
        },

        /**
         * Получение списка пользователей из файла json.
         * Используется в том случае, если в localStorage не было сохранено готовое состояние.
         * В методе используется плагин Axios для упрощения создания запросов.
         *
         * @param context
         */
        getUsers: context => {
            axios
                .get('/json/users.json')
                .then(response => {
                    context.commit('changeUsers', response.data);
                    store.dispatch('getTasks')
                })
                .catch(() => {
                    context.commit('changeUsers', []);
                });
        },

        /**
         * Получение списка задач из файла json.
         * Используется в том случае, если в localStorage не было сохранено готовое состояние.
         * В методе используется плагин Axios для упрощения создания запросов.
         *
         * @param context
         */
        getTasks: context => {
            axios
                .get('/json/tasks.json')
                .then(response => {
                    context.commit('changeTasks', response.data);
                    store.dispatch('updateTasksWatchers')
                })
                .catch(() => {
                    context.commit('changeTasks', []);
                });
        },

        /**
         * Прогон всех задач в цикле и обновление юзеров отслеживающих конкретную задачу.
         * Для отображения все поля не нужны, поэтому добавляются только необходимые: id, имя, ссылка на картинку.
         *
         * @param commit
         * @param state
         * @param dispatch
         */
        updateTasksWatchers: ({commit, state, dispatch}) => {
            let updatedTasks = [];
            let users = deepCopy(state.users);
            let tasks = deepCopy(state.tasks);

            tasks.forEach(task => {
                let updatedWatchers = [];

                if (Array.isArray(task.watchers) && task.watchers.length) {
                    task.watchers.forEach(watcher => {
                        let user = users.find(user => user.id === watcher);

                        updatedWatchers.push({
                            id: user.id,
                            name: user.first_name + ' ' + user.last_name,
                            image: user.image
                        });
                    });
                }

                task.watchers = updatedWatchers;
                updatedTasks.push(task);
            });

            commit('changeTasks', updatedTasks);
            dispatch('splitData');
        },

        /**
         * Объединение двух состояний: список пользователей и список задач в один массив.
         * Прогон в цикле всех пользователей и добавление ему задач с такими же ID.
         * Готовый массив помещается в стейт "result", откуда строится таблица приложения.
         *
         * @param commit
         * @param state
         */
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

        /**
         * Обновление порядка списка задач после перетаскивания.
         * На вход принимается объект с обновленным массивом списком задач пользователя, в котором было перетаскивание и
         * ID этого пользователя.
         * Используется плагином Vue-Slicksort.
         *
         * @param commit
         * @param state
         * @param payload
         */
        updateSortedTasks: ({commit, state}, payload) => {
            if (!Array.isArray(payload.sortedTasks)) {
                throw new Error("Invalid array with tasks...")
            }

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

        /**
         * Удаление пользователя.
         * На входе только ID пользователя, которого нужно удалить.
         *
         * @param commit
         * @param state
         * @param dispatch
         * @param {number} payload
         */
        removeUser: ({commit, state, dispatch}, payload) => {
            if (typeof payload !== "number") {
                throw new Error("Invalid user ID...");
            }

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

        /**
         * Открытие и закрытие модального окна.
         *
         * Чтобы открыть модальное окно, необходимо отправить параметр в виде строки с типом модального окна, который
         * указан в условии отображения, либо объект с ключом "type" и типом в значении ключа.
         *
         * Чтобы закрыть модальное окно, необходимо отправить параметр "close".
         *
         * @param state
         * @param commit
         * @param {{type: string, params: Object}|string} payload
         */
        toggleModal: ({state, commit}, payload) => {
            let modalData = deepCopy(state.modal);

            if (typeof payload === "string" && payload === "close") {
                modalData = {
                    visible: false,
                    type: undefined,
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
                throw new Error("Modal's type isn't defined...");
            }

            commit('changeModal', modalData);
        },

        /**
         * Удаление задачи.
         * На вход принимается ID задачи, которую нужно удалить.
         *
         * @param state
         * @param dispatch
         * @param commit
         * @param {number} payload
         */
        removeTask: ({state, dispatch, commit}, payload) => {
            if (typeof payload !== "number") {
                throw new Error("Invalid task ID...");
            }

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

            dispatch("splitData").then(() => {
                dispatch("toggleModal", "close");
            });
        },

        /**
         * Создание пользователя.
         * На входе объект с именем, фамилией и ссылкой на аватар пользователя.
         *
         * @param state
         * @param commit
         * @param dispatch
         * @param {Object} payload
         */
        createUser: ({state, commit, dispatch}, payload) => {
            if (typeof payload !== "object") {
                throw new Error("Invalid user parameters...");
            }

            const userInfo = {
                ...payload,
                id: state.users.length + 1,
                tasks: [],
            };

            let updatedUsers = deepCopy(state.users);

            updatedUsers.push(userInfo);

            commit("changeUsers", updatedUsers);
            dispatch("splitData").then(() => {
                dispatch("toggleModal", "close");
            });
        },

        /**
         * Добавление или изменение задачи.
         * На вход принимается объект с двумя ключами: тип действия (добавление/изменение), параметры задачи.
         * Автоматически подставляется текущая дата.
         *
         * @param state
         * @param commit
         * @param dispatch
         * @param {{type: string, task: Object}} payload
         */
        pushTask: ({state, commit, dispatch}, payload) => {
            if (typeof payload.type !== "string") {
                throw new Error("Invalid action type...");
            }

            if (typeof payload.task !== "object") {
                throw new Error("Task params is empty...");
            }

            let tasks = deepCopy(state.tasks);
            let users = deepCopy(state.users);
            let modalParams = deepCopy(state.modal.params);

            let listCheck =
                Array.isArray(payload.task.list) && payload.task.list.length && payload.task.list[0] !== "";

            let responsibleID = payload.task.responsible.id;
            let task = {
                date: new Date().toISOString(),
                desc: payload.task.desc,
                id: payload.task.id,
                list: listCheck ? payload.task.list : [],
                name: payload.task.name,
                watchers: payload.task.watchers
            };

            if (Array.isArray(task.watchers) && task.watchers.length) {
                task.watchers.forEach((watcher, index) => {
                    task.watchers[index] = watcher.id
                });
            }

            tasks.forEach((taskItem, taskIndex) => {
                taskItem.watchers.forEach((watcher, watcherIndex) => {
                    tasks[taskIndex].watchers[watcherIndex] = watcher.id
                });
            });

            if (responsibleID !== modalParams.responsible && payload.type === "update-task") {
                let oldResponsible = users.find(user => user.id === modalParams.responsible);
                let newResponsible = users.find(user => user.id === responsibleID);

                oldResponsible.tasks.forEach((taskItem, index) => {
                    if (task.id === taskItem.id || task.id === taskItem) {
                        oldResponsible.tasks.splice(index, 1);
                    }
                });

                newResponsible.tasks.push(task.id);
            }

            users.forEach((user, userIndex) => {
                user.tasks.forEach((taskItem, taskIndex) => {
                    users[userIndex].tasks[taskIndex] = taskItem.id ? taskItem.id : taskItem;
                });

                if (user.id === responsibleID && payload.type === "new-task") {
                    users[userIndex].tasks.push(task.id);
                }
            });

            if (payload.type === "new-task") {
                tasks.push(task);
            } else if (payload.type === "update-task") {
                tasks.forEach((el, index) => {
                    if (el.id === task.id) {
                        tasks[index] = task;
                    }
                });
            }

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

        /**
         * Получение результатирующего состояния.
         *
         * @param state
         * @return {Array}
         */
        getResult: state => {
            return state.result;
        },

        /**
         * Получение состояния модального окна.
         *
         * @param state
         * @return {{visible: boolean, type: undefined|string, params: {}}}
         */
        getModalData: state => {
            return state.modal;
        },

        /**
         * Получение списка задач.
         *
         * @param state
         * @return {Array}
         */
        getTasks: state => {
            return state.tasks;
        }
    }
})

export default store;
