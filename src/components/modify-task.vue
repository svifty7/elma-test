<template>
    <form class="create-task" @submit.prevent="">
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
                      @addOption="addOption"
        ></options-list>

        <div class="create-task__label">
            <span class="create-task__label--faker">Ответственный</span>
            <Multiselect :options="result"
                         placeholder="Выбрать ответственного"
                         ref="responsible"
                         v-model="task.responsible"
                         track-by="name"
                         label="name"
            ></Multiselect>
        </div>

        <div class="create-task__label">
            <span class="create-task__label--faker">Отслеживают</span>
            <Multiselect :options="result"
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

        <button class="create-task__btn">{{type === 'update-task' ? 'Сохранить' : 'Добавить'}}</button>
        <button class="create-task__btn remove"
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
            }
        },
        components: {
            optionsList,
            Multiselect
        },
        mounted() {
            const modalData = this.$store.getters.getModalData;

            this.type = modalData.type;

            this.task = {
                id: modalData.params.id,
                name: modalData.params.name,
                desc: modalData.params.desc,
                list: modalData.params.list && modalData.params.list.length ? modalData.params.list : [""],
                date: modalData.params.date,
                watchers: modalData.params.watchers,
                responsible: this.result.find(user => user.id === modalData.params.responsible)
            }
        },
        computed: {
            result() {
                return this.$store.getters.getResult;
            }
        },
        methods: {
            addOption() {
                this.task.list.push("")
            },

            removeTask() {
                this.$store.dispatch("removeTask", this.task.id);
            }
        }
    }
</script>
