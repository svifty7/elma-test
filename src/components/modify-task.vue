<template>
    <form class="create-task" @submit.prevent="submitTask">
        <div class="create-task__title">
            {{type === "new-task" ? "Новая задача" : "Изменить задачу"}}
        </div>
        <label class="create-task__label">
            <span class="create-task__label--faker">Название задачи</span>
            <input type="text"
                   class="create-task__input"
                   name="task-name"
                   placeholder="Название задачи"
                   v-model="task.name"
                   required="required"
                   autofocus="autofocus"
            >
        </label>

        <label class="create-task__label">
            <span class="create-task__label--faker">Описание</span>
            <textarea class="create-task__textarea"
                      name="task-desc"
                      placeholder="Описание задачи"
                      v-model="task.desc"
            ></textarea>
        </label>

        <options-list :list="task.list"
                      @add-option="addOption"
                      @remove-option="removeOption"
        ></options-list>

        <div class="create-task__label">
            <span class="create-task__label--faker">Ответственный</span>
            <Multiselect :options="users"
                         placeholder="Выбрать ответственного"
                         ref="responsible"
                         v-model="task.responsible"
                         track-by="name"
                         label="name"
            ></Multiselect>
        </div>

        <div class="create-task__label">
            <span class="create-task__label--faker">Отслеживают</span>
            <Multiselect :options="users"
                         placeholder="Выбрать отслеживающих"
                         ref="watchers"
                         v-model="task.watchers"
                         track-by="name"
                         label="name"
                         :multiple="true"
                         :close-on-select="false"
                         :clear-on-select="false"
                         :preserve-search="true"
            >
                <template slot="selection" slot-scope="{ values, search, isOpen }">
                    <span class="multiselect__single"
                          v-if="values.length > 1 && !isOpen"
                    >{{ values.length }} выбрано</span>
                    <span class="multiselect__single"
                          v-else-if="values.length === 1 && !isOpen"
                    >{{values[0].name}}</span>
                </template>
            </Multiselect>
        </div>

        <button type="submit" class="create-task__btn">{{type === 'update-task' ? 'Сохранить' : 'Добавить'}}</button>
        <button type="button" class="create-task__btn remove"
                v-if="type === 'update-task'"
                @click.prevent="removeTask"
        >Удалить задачу
        </button>
    </form>
</template>

<script>
    import optionsList from "@/components/options-list";
    import Multiselect from "vue-multiselect";
    import {deepCopy} from "@/helpers/deep-copy";

    export default {
        name: "modify-task",
        data() {
            return {
                type: undefined,
                task: {},
                users: [],
                tasks: []
            }
        },
        components: {
            optionsList,
            Multiselect
        },
        mounted() {
            const modalData = deepCopy(this.$store.getters.getModalData);
            const users = deepCopy(this.$store.getters.getResult);
            const tasks = deepCopy(this.$store.getters.getTasks);
            const taskUser = modalData.params.user ?
                modalData.params.user :
                users.find(user => user.id === modalData.params.responsible);

            this.type = modalData.type;
            this.users = users;
            this.tasks = tasks;

            this.task = {
                id: modalData.params.id ? modalData.params.id : tasks.length + 1,
                name: modalData.params.name,
                desc: modalData.params.desc,
                list: modalData.params.list && modalData.params.list.length ? modalData.params.list : [""],
                watchers: modalData.params.watchers,
                responsible: taskUser,
            }
        },
        methods: {

            /**
             * Добавление пустого поля в список внутри задачи.
             */
            addOption() {
                this.task.list.push("")
            },

            /**
             * Удаление поля из списка внутри задачи.
             * Если список стал пустым, то добавляется пустой элемент.
             *
             * @param {number} index
             */
            removeOption(index) {
                this.task.list.splice(index, 1);

                if (this.task.list.length === 0) {
                    this.addOption();
                }
            },

            /**
             * Вызов метода для удаления задачи.
             * В параметре указывается ID задачи.
             */
            removeTask() {
                this.$store.dispatch("removeTask", this.task.id);
            },

            /**
             * Вызов метода для создания или обновления задачи.
             * В параметре отправляется объект с типом действия и параметрами задачи.
             */
            submitTask() {
                const pushData = {
                    type: this.type,
                    task: this.task
                }

                this.$store.dispatch("pushTask", deepCopy(pushData));
            },
        }
    }
</script>
