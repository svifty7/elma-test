<template>
    <form class="create-task">
        <div class="create-task__title">
            {{data && data.type === "new-task" ? "Новая задача" : "Изменить задачу"}}
        </div>
        <label class="create-task__label">
            <span class="create-task__label--faker">Название задачи</span>
            <input type="text"
                   class="create-task__input"
                   name="task-name"
                   placeholder="Название задачи"
                   :value="task.name"
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

        <button class="create-task__btn">Сохранить</button>
        <button class="create-task__btn remove"
                v-if="data.type === 'update-task'"
                @click.prevent="removeTask"
        >Удалить задачу</button>
    </form>
</template>

<script>
    import optionsList from "@/components/options-list";

    export default {
        name: "create-task",
        props: ["data"],
        components: {
            optionsList
        },
        computed: {
            task() {
                return {
                    id: this.data.params.id,
                    name: this.data.params.name,
                    desc: this.data.params.desc,
                    list: this.data.params.list ? this.data.params.list : [""],
                    date: this.data.params.date,
                    watchers: this.data.params.watchers
                }
            }
        },
        methods: {
            addOption() {
                this.task.list.push("")
            },

            removeTask() {
                this.$store.dispatch("toggleModal", "close");
                this.$store.dispatch("removeTask", this.task.id);
            }
        }
    }
</script>
