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
            const modalData = this.$store.getters.getModalData;
            const users = this.$store.getters.getResult;
            const tasks = this.$store.getters.getTasks;
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
            addOption() {
                this.task.list.push("")
            },

            removeOption(index) {
                this.task.list.splice(index, 1)
            },

            removeTask() {
                this.$store.dispatch("removeTask", this.task.id);
            },

            submitTask() {
                this.$store.dispatch("pushTask", this.task);
            },
        }
    }
</script>
